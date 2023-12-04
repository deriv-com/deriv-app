import { TMessageFnProps } from '../types';

// this function should work once BE WALL-1440 is delivered
const lifetimeAccountLimitsBetweenWalletsMessageFn = ({
    activeWallet,
    displayMoney,
    exchangeRates,
    limits,
    sourceAccount,
    sourceAmount,
    targetAccount,
}: TMessageFnProps) => {
    if (sourceAccount?.account_category !== 'wallet' || targetAccount?.account_category !== 'wallet') return null;

    const sourceWalletType = sourceAccount.account_type === 'crypto' ? 'crypto' : 'fiat';
    const targetWalletType = targetAccount.account_type === 'crypto' ? 'crypto' : 'fiat';
    const limitsCaseKey = `${sourceWalletType}_to_${targetWalletType}` as const;

    //@ts-expect-error needs backend type
    const allowedSumActiveWalletCurrency = limits?.lifetime_transfers?.[limitsCaseKey].allowed as number;
    //@ts-expect-error needs backend type
    const availableSumActiveWalletCurrency = limits?.lifetime_transfers?.[limitsCaseKey].available as number;

    if (
        !sourceAccount.currency ||
        !exchangeRates?.rates?.[sourceAccount.currency] ||
        !targetAccount.currency ||
        !exchangeRates?.rates?.[targetAccount.currency] ||
        !sourceAccount.currencyConfig ||
        !targetAccount.currencyConfig
    )
        return null;

    const transferDirection = activeWallet.loginid === sourceAccount.loginid ? 'from' : 'to';

    const allowedSumConverted =
        allowedSumActiveWalletCurrency *
        (exchangeRates?.rates[transferDirection === 'from' ? targetAccount.currency : sourceAccount.currency] ?? 1);
    const availableSumConverted =
        availableSumActiveWalletCurrency *
        (exchangeRates?.rates[transferDirection === 'from' ? targetAccount.currency : sourceAccount.currency] ?? 1);

    const sourceCurrencyLimit = transferDirection === 'from' ? allowedSumActiveWalletCurrency : allowedSumConverted;
    const targetCurrencyLimit = transferDirection === 'from' ? allowedSumConverted : allowedSumActiveWalletCurrency;

    const sourceCurrencyRemainder =
        transferDirection === 'from' ? availableSumActiveWalletCurrency : availableSumConverted;
    const targetCurrencyRemainder =
        transferDirection === 'from' ? availableSumConverted : availableSumActiveWalletCurrency;

    const formattedSourceCurrencyLimit = displayMoney?.(
        sourceCurrencyLimit,
        sourceAccount.currencyConfig.display_code,
        sourceAccount.currencyConfig.fractional_digits
    );
    const formattedTargetCurrencyLimit = displayMoney?.(
        targetCurrencyLimit,
        targetAccount.currencyConfig.display_code,
        targetAccount.currencyConfig?.fractional_digits
    );

    const formattedSourceCurrencyRemainder = displayMoney?.(
        sourceCurrencyRemainder,
        sourceAccount.currencyConfig.display_code,
        sourceAccount.currencyConfig.fractional_digits
    );
    const formattedTargetCurrencyRemainder = displayMoney?.(
        targetCurrencyRemainder,
        targetAccount.currencyConfig?.display_code,
        targetAccount.currencyConfig?.fractional_digits
    );

    if (availableSumActiveWalletCurrency === 0)
        return {
            text: `You've reached the lifetime transfer limit from your ${sourceAccount.accountName} to any ${targetWalletType} Wallet. Verify your account to upgrade the limit.`,
            type: 'error' as const,
        };

    if (allowedSumActiveWalletCurrency === availableSumActiveWalletCurrency)
        return {
            text: `The lifetime transfer limit from ${sourceAccount.accountName} to any ${targetWalletType} Wallet is ${formattedSourceCurrencyLimit} (${formattedTargetCurrencyLimit}).`,
            type: sourceAmount > sourceCurrencyRemainder ? ('error' as const) : ('success' as const),
        };

    return {
        text: `Remaining lifetime transfer limit is ${formattedSourceCurrencyRemainder} (${formattedTargetCurrencyRemainder}). Verify your account to upgrade the limit.`,
        type: sourceAmount > sourceCurrencyRemainder ? ('error' as const) : ('success' as const),
    };
};

const cumulativeAccountLimitsMessageFn = ({
    displayMoney,
    exchangeRates,
    limits,
    sourceAccount,
    sourceAmount,
    targetAccount,
}: TMessageFnProps) => {
    const isTransferBetweenWallets =
        sourceAccount.account_category === 'wallet' && targetAccount.account_category === 'wallet';
    const isSameCurrency = sourceAccount.currency === targetAccount.currency;

    const keyAccountType =
        [sourceAccount, targetAccount].find(acc => acc.account_category !== 'wallet')?.account_type ?? 'wallets';

    const platformKey = keyAccountType === 'standard' ? 'dtrade' : keyAccountType;

    //@ts-expect-error needs backend type
    const allowedSumUSD = limits?.daily_cumulative_amount_transfers?.[platformKey].allowed as number;
    //@ts-expect-error needs backend type
    const availableSumUSD = limits?.daily_cumulative_amount_transfers?.[platformKey].available as number;

    if (
        !sourceAccount.currency ||
        !exchangeRates?.rates?.[sourceAccount.currency] ||
        !targetAccount.currency ||
        !exchangeRates?.rates?.[targetAccount.currency] ||
        !sourceAccount.currencyConfig ||
        !targetAccount.currencyConfig
    )
        return null;

    const sourceCurrencyLimit = allowedSumUSD * (exchangeRates.rates[sourceAccount.currency] ?? 1);
    const targetCurrencyLimit = allowedSumUSD * (exchangeRates.rates[targetAccount.currency] ?? 1);

    const sourceCurrencyRemainder = availableSumUSD * (exchangeRates.rates[sourceAccount.currency] ?? 1);
    const targetCurrencyRemainder = availableSumUSD * (exchangeRates.rates[targetAccount.currency] ?? 1);

    const formattedSourceCurrencyLimit = displayMoney?.(
        sourceCurrencyLimit,
        sourceAccount.currencyConfig.display_code,
        sourceAccount.currencyConfig.fractional_digits
    );
    const formattedTargetCurrencyLimit = displayMoney?.(
        targetCurrencyLimit,
        targetAccount.currencyConfig.display_code,
        targetAccount.currencyConfig?.fractional_digits
    );

    const formattedSourceCurrencyRemainder = displayMoney?.(
        sourceCurrencyRemainder,
        sourceAccount.currencyConfig.display_code,
        sourceAccount.currencyConfig.fractional_digits
    );
    const formattedTargetCurrencyRemainder = displayMoney?.(
        targetCurrencyRemainder,
        targetAccount.currencyConfig?.display_code,
        targetAccount.currencyConfig?.fractional_digits
    );

    if (availableSumUSD === 0)
        return {
            text: `You have reached your daily transfer limit of ${formattedSourceCurrencyLimit} ${
                !isSameCurrency ? ` (${formattedTargetCurrencyLimit})` : ''
            } between your ${
                isTransferBetweenWallets ? 'Wallets' : `${sourceAccount.accountName} and ${targetAccount.accountName}`
            }. The limit will reset at 00:00 GMT.`,
            type: 'error' as const,
        };

    if (allowedSumUSD === availableSumUSD)
        return {
            text: `The daily transfer limit between your ${
                isTransferBetweenWallets ? 'Wallets' : `${sourceAccount.accountName} and ${targetAccount.accountName}`
            } is ${formattedSourceCurrencyLimit}${!isSameCurrency ? ` (${formattedTargetCurrencyLimit})` : ''}.`,
            type: sourceAmount > sourceCurrencyRemainder ? ('error' as const) : ('success' as const),
        };

    return {
        text: `The remaining daily transfer limit between ${
            isTransferBetweenWallets ? 'Wallets' : `your ${sourceAccount.accountName} and ${targetAccount.accountName}`
        } is ${formattedSourceCurrencyRemainder}${!isSameCurrency ? ` (${formattedTargetCurrencyRemainder})` : ''}.`,
        type: sourceAmount > sourceCurrencyRemainder ? ('error' as const) : ('success' as const),
    };
};

export { cumulativeAccountLimitsMessageFn, lifetimeAccountLimitsBetweenWalletsMessageFn };
