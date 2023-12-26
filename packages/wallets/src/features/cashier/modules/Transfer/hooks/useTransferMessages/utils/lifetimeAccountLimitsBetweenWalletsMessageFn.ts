import { TMessageFnProps, TTransferMessage } from '../../../types';

let text: TTransferMessage['message']['text'], values: TTransferMessage['message']['values'];

const verifyPOIAction = {
    buttonLabel: 'Verify',
    navigateTo: '/account/proof-of-identity',
    shouldOpenInNewTab: true,
};

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

    if (availableSumActiveWalletCurrency === 0) {
        text =
            targetWalletType === 'crypto'
                ? "You've reached the lifetime transfer limit from your {{sourceAccountName}} to any cryptocurrency Wallet. Verify your account to upgrade the limit."
                : "You've reached the lifetime transfer limit from your {{sourceAccountName}} to any fiat Wallet. Verify your account to upgrade the limit.";
        values = { sourceAccountName: sourceAccount.accountName };

        return {
            action: verifyPOIAction,
            message: { text, values },
            type: 'error' as const,
        };
    }

    if (allowedSumActiveWalletCurrency === availableSumActiveWalletCurrency)
        switch (limitsCaseKey) {
            case 'fiat_to_crypto':
            case 'crypto_to_fiat':
                text =
                    targetWalletType === 'crypto'
                        ? 'The lifetime transfer limit from {{sourceAccountName}} to any cryptocurrency Wallets is up to {{formattedSourceCurrencyLimit}}.'
                        : 'The lifetime transfer limit from {{sourceAccountName}} to any fiat Wallets is up to {{formattedSourceCurrencyLimit}}.';
                values = { formattedSourceCurrencyLimit, sourceAccountName: sourceAccount.accountName };

                return {
                    message: { text, values },
                    type: 'success' as const,
                };
            case 'crypto_to_crypto':
                text =
                    'The lifetime transfer limit between cryptocurrency Wallets is up to {{formattedSourceCurrencyLimit}}.';
                values = { formattedSourceCurrencyLimit };

                return {
                    message: { text, values },
                    type: 'success' as const,
                };
            default:
                return null;
        }

    switch (limitsCaseKey) {
        case 'fiat_to_crypto':
        case 'crypto_to_fiat':
            text =
                targetWalletType === 'crypto'
                    ? 'Your remaining lifetime transfer limit from {{sourceAccountName}} to any cryptocurrency Wallets is {{formattedSourceCurrencyRemainder}}. Verify your account to upgrade the limit.'
                    : 'Your remaining lifetime transfer limit from {{sourceAccountName}} to any fiat Wallets is {{formattedSourceCurrencyRemainder}}. Verify your account to upgrade the limit.';
            values = { formattedSourceCurrencyRemainder, sourceAccountName: sourceAccount.accountName };

            return {
                action: verifyPOIAction,
                message: { text, values },
                type: 'success' as const,
            };
        case 'crypto_to_crypto':
            text =
                'Your remaining lifetime transfer limit between cryptocurrency Wallets is {{formattedSourceCurrencyRemainder}}. Verify your account to upgrade the limit.';
            values = { formattedSourceCurrencyRemainder };

            return {
                action: verifyPOIAction,
                message: { text, values },
                type: 'success' as const,
            };
        default:
            return null;
    }
};

export default lifetimeAccountLimitsBetweenWalletsMessageFn;
