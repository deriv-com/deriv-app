import { TMessageFnProps } from '../types';

const cumulativeAccountLimitsMessageFn = ({
    activeWallet,
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

    const isDemoTransfer = activeWallet?.is_virtual;

    const keyAccountType =
        [sourceAccount, targetAccount].find(acc => acc.account_category !== 'wallet')?.account_type ?? 'wallets';

    const platformKey = keyAccountType === 'standard' ? 'dtrade' : keyAccountType;

    const allowedSumUSD = isDemoTransfer
        ? //@ts-expect-error needs backend type
          (limits?.daily_cumulative_amount_transfers?.virtual.allowed as number)
        : //@ts-expect-error needs backend type
          (limits?.daily_cumulative_amount_transfers?.[platformKey].allowed as number);

    const availableSumUSD = isDemoTransfer
        ? //@ts-expect-error needs backend type
          (limits?.daily_cumulative_amount_transfers?.virtual.available as number)
        : //@ts-expect-error needs backend type
          (limits?.daily_cumulative_amount_transfers?.[platformKey].available as number);

    if (
        !sourceAccount.currency ||
        !targetAccount.currency ||
        !sourceAccount.currencyConfig ||
        !targetAccount.currencyConfig
    )
        return null;

    const formattedDemoLimit = displayMoney?.(
        availableSumUSD,
        sourceAccount.currencyConfig.display_code,
        sourceAccount.currencyConfig.fractional_digits
    );

    if (isDemoTransfer) {
        if (allowedSumUSD === availableSumUSD) {
            return {
                text: `Your daily transfer limit for virtual funds is ${formattedDemoLimit}.`,
                type: 'success',
            } as const;
        }
        return {
            text: `Your remaining daily transfer limit for virtual funds is ${formattedDemoLimit}.`,
            type: 'success',
        } as const;
    }

    // separated the exchangeRates check to prevent checking for demo transfer
    if (!exchangeRates?.rates?.[targetAccount.currency] || !exchangeRates?.rates?.[sourceAccount.currency]) return null;

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

    if (allowedSumUSD === availableSumUSD) {
        return {
            text: `The daily transfer limit between your ${
                isTransferBetweenWallets ? 'Wallets' : `${sourceAccount.accountName} and ${targetAccount.accountName}`
            } is ${formattedSourceCurrencyLimit}${!isSameCurrency ? ` (${formattedTargetCurrencyLimit})` : ''}.`,
            type: sourceAmount > sourceCurrencyRemainder ? ('error' as const) : ('success' as const),
        };
    }

    return {
        text: `The remaining daily transfer limit between ${
            isTransferBetweenWallets ? 'Wallets' : `your ${sourceAccount.accountName} and ${targetAccount.accountName}`
        } is ${formattedSourceCurrencyRemainder}${!isSameCurrency ? ` (${formattedTargetCurrencyRemainder})` : ''}.`,
        type: sourceAmount > sourceCurrencyRemainder ? ('error' as const) : ('success' as const),
    };
};

export default cumulativeAccountLimitsMessageFn;
