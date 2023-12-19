import { TMessageFnProps } from '../../../types';

const cumulativeAccountLimitsMessageFn = ({
    activeWallet,
    activeWalletExchangeRates,
    displayMoney,
    limits,
    sourceAccount,
    sourceAmount,
    targetAccount,
}: TMessageFnProps) => {
    const isTransferBetweenWallets =
        sourceAccount.account_category === 'wallet' && targetAccount.account_category === 'wallet';

    const isDemoTransfer = activeWallet?.is_virtual;

    const keyAccountType =
        [sourceAccount, targetAccount].find(acc => acc.account_category !== 'wallet')?.account_type ?? 'wallets';

    const platformKey = keyAccountType === 'standard' ? 'dtrade' : keyAccountType;

    const allowedSumUSD = isDemoTransfer
        ? //@ts-expect-error needs backend type
          (limits?.daily_cumulative_amount_transfers?.virtual?.allowed as number)
        : //@ts-expect-error needs backend type
          (limits?.daily_cumulative_amount_transfers?.[platformKey]?.allowed as number);

    const availableSumUSD = isDemoTransfer
        ? //@ts-expect-error needs backend type
          (limits?.daily_cumulative_amount_transfers?.virtual?.available as number)
        : //@ts-expect-error needs backend type
          (limits?.daily_cumulative_amount_transfers?.[platformKey]?.available as number);

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
                key: 'CUMULATIVE_TRANSFER_LIMIT_ALLOWED_DEMO' as const,
                type: 'success' as const,
                values: { formattedDemoLimit },
            };
        }
        return {
            key: 'CUMULATIVE_TRANSFER_LIMIT_AVAILABLE_DEMO' as const,
            type: 'success' as const,
            values: { formattedDemoLimit },
        };
    }

    // separated the exchangeRates check to prevent checking for demo transfer
    if (
        (sourceAccount.currency !== activeWallet.currency &&
            !activeWalletExchangeRates?.rates?.[sourceAccount.currency]) ||
        (targetAccount.currency !== activeWallet.currency &&
            !activeWalletExchangeRates?.rates?.[targetAccount.currency])
    )
        return null;

    const sourceCurrencyLimit = allowedSumUSD * (activeWalletExchangeRates?.rates?.[sourceAccount.currency] ?? 1);

    const sourceCurrencyRemainder = availableSumUSD * (activeWalletExchangeRates?.rates?.[sourceAccount.currency] ?? 1);

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

    if (availableSumUSD === 0)
        return {
            key: 'CUMULATIVE_TRANSFER_LIMIT_REACHED' as const,
            type: 'error' as const,
            values: {
                formattedSourceCurrencyLimit,
                isTransferBetweenWallets,
                sourceAccountName: sourceAccount.accountName,
                targetAccountName: targetAccount.accountName,
            },
        };

    if (allowedSumUSD === availableSumUSD)
        return {
            key: 'CUMULATIVE_TRANSFER_LIMIT_ALLOWED' as const,
            type: sourceAmount > sourceCurrencyRemainder ? ('error' as const) : ('success' as const),
            values: {
                formattedSourceCurrencyLimit,
                isTransferBetweenWallets,
                sourceAccountName: sourceAccount.accountName,
                targetAccountName: targetAccount.accountName,
            },
        };

    return {
        key: 'CUMULATIVE_TRANSFER_LIMIT_AVAILABLE' as const,
        type: sourceAmount > sourceCurrencyRemainder ? ('error' as const) : ('success' as const),
        values: {
            formattedSourceCurrencyRemainder,
            isTransferBetweenWallets,
            sourceAccountName: sourceAccount.accountName,
            targetAccountName: targetAccount.accountName,
        },
    };
};

export default cumulativeAccountLimitsMessageFn;
