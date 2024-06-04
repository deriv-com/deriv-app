import { TMessageFnProps, TTransferMessage } from '../../../types';

let text: TTransferMessage['message']['text'], values: TTransferMessage['message']['values'];

const cumulativeAccountLimitsMessageFn = ({
    activeWallet,
    activeWalletExchangeRates,
    displayMoney,
    limits,
    sourceAccount,
    sourceAmount,
    targetAccount,
}: TMessageFnProps) => {
    if (!targetAccount) return null;

    const isTransferBetweenWallets =
        sourceAccount.account_category === 'wallet' && targetAccount.account_category === 'wallet';

    const isDemoTransfer = activeWallet?.is_virtual;

    const keyAccountType =
        [sourceAccount, targetAccount].find(acc => acc.account_category !== 'wallet')?.account_type ?? 'internal';

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
        !targetAccount.currencyConfig ||
        !allowedSumUSD ||
        !availableSumUSD
    )
        return null;

    const formattedDemoLimit = displayMoney?.(
        availableSumUSD,
        sourceAccount.currencyConfig.display_code,
        sourceAccount.currencyConfig.fractional_digits
    );

    if (isDemoTransfer) {
        if (allowedSumUSD === availableSumUSD) {
            text = 'Your daily transfer limit for virtual funds is {{formattedDemoLimit}}';
            values = { formattedDemoLimit };

            return {
                message: { text, values },
                type: 'success' as const,
            };
        }

        text = 'Your remaining daily transfer limit for virtual funds is {{formattedDemoLimit}}.';
        values = { formattedDemoLimit };

        return {
            message: { text, values },
            type: 'success' as const,
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

    const USDToSourceRate =
        activeWallet.currency === sourceAccount.currency
            ? 1 / (activeWalletExchangeRates?.rates?.USD ?? 1)
            : // if the source ("from") account is not the active wallet,
              // compute USD -> sourceCurrency rate as activeWalletCurrency -> sourceCurrency rate,
              // divided by activeWalletCurrency -> USD rate
              (activeWalletExchangeRates?.rates?.[sourceAccount.currency] ?? 1) /
              (activeWalletExchangeRates?.rates?.USD ?? 1);

    const sourceCurrencyLimit = allowedSumUSD * USDToSourceRate;
    const sourceCurrencyRemainder = availableSumUSD * USDToSourceRate;

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

    if (availableSumUSD === 0) {
        text = isTransferBetweenWallets
            ? 'You have reached your daily transfer limit of {{formattedSourceCurrencyLimit}} between your Wallets. The limit will reset at 00:00 GMT.'
            : 'You have reached your daily transfer limit of {{formattedSourceCurrencyLimit}} between your {{sourceAccountName}} and {{targetAccountName}}. The limit will reset at 00:00 GMT.';
        values = {
            formattedSourceCurrencyLimit,
            sourceAccountName: sourceAccount.accountName,
            targetAccountName: targetAccount.accountName,
        };

        return {
            message: { text, values },
            type: 'error' as const,
        };
    }

    if (allowedSumUSD === availableSumUSD) {
        text = isTransferBetweenWallets
            ? 'The daily transfer limit between your Wallets is {{formattedSourceCurrencyLimit}}.'
            : 'The daily transfer limit between your {{sourceAccountName}} and {{targetAccountName}} is {{formattedSourceCurrencyLimit}}.';
        values = {
            formattedSourceCurrencyLimit,
            sourceAccountName: sourceAccount.accountName,
            targetAccountName: targetAccount.accountName,
        };

        return {
            message: { text, values },
            type: sourceAmount > sourceCurrencyRemainder ? ('error' as const) : ('success' as const),
        };
    }

    text = isTransferBetweenWallets
        ? 'The remaining daily transfer limit between your Wallets is {{formattedSourceCurrencyRemainder}}.'
        : 'The remaining daily transfer limit between your {{sourceAccountName}} and {{targetAccountName}} is {{formattedSourceCurrencyRemainder}}.';
    values = {
        formattedSourceCurrencyRemainder,
        sourceAccountName: sourceAccount.accountName,
        targetAccountName: targetAccount.accountName,
    };

    return {
        message: { text, values },
        type: sourceAmount > sourceCurrencyRemainder ? ('error' as const) : ('success' as const),
    };
};

export default cumulativeAccountLimitsMessageFn;
