import { TMessageFnProps } from '../types';

// this function should work once BE WALL-1440 is delivered
const lifetimeAccountLimitsBetweenWalletsMessageFn = ({
    activeWallet,
    activeWalletExchangeRates,
    displayMoney,
    limits,
    sourceAccount,
    targetAccount,
}: TMessageFnProps) => {
    if (sourceAccount?.account_category !== 'wallet' || targetAccount?.account_category !== 'wallet') return null;

    const sourceWalletType = sourceAccount.account_type === 'crypto' ? 'crypto' : 'fiat';
    const targetWalletType = targetAccount.account_type === 'crypto' ? 'crypto' : 'fiat';
    const limitsCaseKey = `${sourceWalletType}_to_${targetWalletType}` as const;

    //@ts-expect-error needs backend type
    const allowedSumActiveWalletCurrency = limits?.lifetime_transfers?.[limitsCaseKey]?.allowed as number;
    //@ts-expect-error needs backend type
    const availableSumActiveWalletCurrency = limits?.lifetime_transfers?.[limitsCaseKey]?.available as number;

    if (
        !sourceAccount.currency ||
        (sourceAccount.currency !== activeWallet.currency &&
            !activeWalletExchangeRates?.rates?.[sourceAccount.currency]) ||
        !targetAccount.currency ||
        (targetAccount.currency !== activeWallet.currency &&
            !activeWalletExchangeRates?.rates?.[targetAccount.currency]) ||
        !sourceAccount.currencyConfig ||
        !targetAccount.currencyConfig
    )
        return null;

    const transferDirection = activeWallet.loginid === sourceAccount.loginid ? 'from' : 'to';

    const allowedSumConverted =
        allowedSumActiveWalletCurrency *
        (activeWalletExchangeRates?.rates?.[
            transferDirection === 'from' ? targetAccount.currency : sourceAccount.currency
        ] ?? 1);
    const availableSumConverted =
        availableSumActiveWalletCurrency *
        (activeWalletExchangeRates?.rates?.[
            transferDirection === 'from' ? targetAccount.currency : sourceAccount.currency
        ] ?? 1);

    const sourceCurrencyLimit = transferDirection === 'from' ? allowedSumActiveWalletCurrency : allowedSumConverted;

    const sourceCurrencyRemainder =
        transferDirection === 'from' ? availableSumActiveWalletCurrency : availableSumConverted;

    const formattedSourceCurrencyLimit = displayMoney?.(
        sourceCurrencyLimit,
        sourceAccount.currencyConfig.display_code,
        sourceAccount.currencyConfig.fractional_digits
    );

    const formattedSourceCurrencyRemainder = displayMoney?.(
        sourceCurrencyRemainder,
        sourceAccount.currencyConfig.display_code,
        sourceAccount.currencyConfig.fractional_digits
    );

    if (availableSumActiveWalletCurrency === 0)
        return {
            text: `You've reached the lifetime transfer limit from your ${sourceAccount.accountName} to any ${
                targetWalletType === 'crypto' ? 'cryptocurrency' : 'fiat'
            } Wallet. Verify your account to upgrade the limit.`,
            type: 'error' as const,
        };

    if (allowedSumActiveWalletCurrency === availableSumActiveWalletCurrency)
        switch (limitsCaseKey) {
            case 'fiat_to_crypto':
            case 'crypto_to_fiat':
                return {
                    text: `The lifetime transfer limit from ${sourceAccount.accountName} to any ${
                        targetWalletType === 'crypto' ? 'cryptocurrency' : 'fiat'
                    } Wallets is up to ${formattedSourceCurrencyLimit}.`,
                    type: 'success' as const,
                };
            case 'crypto_to_crypto':
                return {
                    text: `The lifetime transfer limit between cryptocurrency Wallets is up to ${formattedSourceCurrencyLimit}.`,
                    type: 'success' as const,
                };
            default:
                return null;
        }

    switch (limitsCaseKey) {
        case 'fiat_to_crypto':
        case 'crypto_to_fiat':
            return {
                text: `Your remaining lifetime transfer limit from ${sourceAccount.accountName} to any ${
                    targetWalletType === 'crypto' ? 'cryptocurrency' : 'fiat'
                } Wallets is ${formattedSourceCurrencyRemainder}. Verify your account to upgrade the limit.`,
                type: 'success' as const,
            };
        case 'crypto_to_crypto':
            return {
                text: `Your remaining lifetime transfer limit between cryptocurrency Wallets is ${formattedSourceCurrencyLimit}. Verify your account to upgrade the limit.`,
                type: 'success' as const,
            };
        default:
            return null;
    }
};

const cumulativeAccountLimitsMessageFn = ({
    USDExchangeRates,
    displayMoney,
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
    const allowedSumUSD = limits?.daily_cumulative_amount_transfers?.[platformKey]?.allowed as number;
    //@ts-expect-error needs backend type
    const availableSumUSD = limits?.daily_cumulative_amount_transfers?.[platformKey]?.available as number;

    if (
        !sourceAccount.currency ||
        (sourceAccount.currency !== 'USD' && !USDExchangeRates?.rates?.[sourceAccount.currency]) ||
        !targetAccount.currency ||
        (targetAccount.currency !== 'USD' && !USDExchangeRates?.rates?.[targetAccount.currency]) ||
        !sourceAccount.currencyConfig ||
        !targetAccount.currencyConfig
    )
        return null;

    const sourceCurrencyLimit = allowedSumUSD * (USDExchangeRates?.rates?.[sourceAccount.currency] ?? 1);
    const targetCurrencyLimit = allowedSumUSD * (USDExchangeRates?.rates?.[targetAccount.currency] ?? 1);

    const sourceCurrencyRemainder = availableSumUSD * (USDExchangeRates?.rates?.[sourceAccount.currency] ?? 1);
    const targetCurrencyRemainder = availableSumUSD * (USDExchangeRates?.rates?.[targetAccount.currency] ?? 1);

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

const transferFeesBetweenWalletsMessageFn = ({
    displayMoney,
    sourceAccount,
    sourceAmount,
    targetAccount,
}: TMessageFnProps) => {
    if (!sourceAccount.currency || !sourceAccount.currencyConfig || !sourceAmount || !targetAccount.currency)
        return null;

    const minimumFeeAmount = 1 / Math.pow(10, sourceAccount.currencyConfig.fractional_digits);

    const minimumFeeText = displayMoney?.(
        minimumFeeAmount,
        sourceAccount.currency,
        sourceAccount.currencyConfig.fractional_digits
    );

    const feePercentage = sourceAccount.currencyConfig?.transfer_between_accounts.fees[targetAccount.currency];

    const feeAmount = (feePercentage * sourceAmount) / 100;

    const feeMessageText = displayMoney?.(
        feeAmount > minimumFeeAmount ? feeAmount : minimumFeeAmount,
        sourceAccount.currency,
        sourceAccount.currencyConfig.fractional_digits
    );

    return {
        text: `Fee: ${feeMessageText} (${feePercentage}% transfer fee or ${minimumFeeText}, whichever is higher, applies for fund transfers between your ${targetAccount.accountName} and cryptocurrency Wallets)`,
        type: 'info' as const,
    };
};

export {
    cumulativeAccountLimitsMessageFn,
    lifetimeAccountLimitsBetweenWalletsMessageFn,
    transferFeesBetweenWalletsMessageFn,
};
