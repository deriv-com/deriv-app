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

export default lifetimeAccountLimitsBetweenWalletsMessageFn;
