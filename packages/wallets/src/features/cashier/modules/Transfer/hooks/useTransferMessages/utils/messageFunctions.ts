import { TMessageFnProps } from '../../../types';

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
            key: 'LIFETIME_TRANSFER_LIMIT_REACHED' as const,
            type: 'error' as const,
            values: {
                sourceAccountName: sourceAccount.accountName,
                targetWalletType,
            },
        };

    if (allowedSumActiveWalletCurrency === availableSumActiveWalletCurrency)
        switch (limitsCaseKey) {
            case 'fiat_to_crypto':
            case 'crypto_to_fiat':
                return {
                    key: 'LIFETIME_TRANSFER_LIMIT_ALLOWED_CRYPTO_AND_FIAT' as const,
                    type: 'success' as const,
                    values: {
                        sourceAccountName: sourceAccount.accountName,
                        targetWalletType,
                    },
                };
            case 'crypto_to_crypto':
                return {
                    key: 'LIFETIME_TRANSFER_LIMIT_ALLOWED_CRYPTO' as const,
                    type: 'success' as const,
                    values: { formattedSourceCurrencyLimit },
                };
            default:
                return null;
        }

    switch (limitsCaseKey) {
        case 'fiat_to_crypto':
        case 'crypto_to_fiat':
            return {
                key: 'LIFETIME_TRANSFER_LIMIT_AVAILABLE_CRYPTO_AND_FIAT' as const,
                type: 'success' as const,
                values: {
                    formattedSourceCurrencyRemainder,
                    sourceAccountName: sourceAccount.accountName,
                    targetWalletType,
                },
            };
        case 'crypto_to_crypto':
            return {
                key: 'LIFETIME_TRANSFER_LIMIT_AVAILABLE_CRYPTO' as const,
                type: 'success' as const,
                values: { formattedSourceCurrencyLimit },
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

    const sourceCurrencyRemainder = availableSumUSD * (USDExchangeRates?.rates?.[sourceAccount.currency] ?? 1);

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
        key: 'TRANSFER_FEE_BETWEEN_WALLETS' as const,
        type: 'info' as const,
        values: {
            feeMessageText,
            feePercentage,
            minimumFeeText,
            targetAccountName: targetAccount.accountName,
        },
    };
};

export {
    cumulativeAccountLimitsMessageFn,
    lifetimeAccountLimitsBetweenWalletsMessageFn,
    transferFeesBetweenWalletsMessageFn,
};
