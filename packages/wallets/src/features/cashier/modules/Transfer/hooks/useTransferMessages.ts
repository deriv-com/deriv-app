import { useCallback, useEffect, useState } from 'react';
import { useAccountLimits, useActiveWalletAccount, useAuthorize, useExchangeRate, usePOI } from '@deriv/api';
import { displayMoney as displayMoney_ } from '@deriv/api/src/utils';
import { THooks } from '../../../../../types';
import { TAccount, TInitialTransferFormValues } from '../types';

type TMessage = {
    text: string;
    type: 'error' | 'success';
};

type TMessageFnProps = {
    activeWallet: THooks.ActiveWalletAccount;
    displayMoney?: (amount: number, currency: string, fractionalDigits: number) => string;
    exchangeRates?: THooks.ExchangeRate;
    limits?: THooks.AccountLimits;
    sourceAccount: NonNullable<TAccount>;
    sourceAmount: number;
    targetAccount: NonNullable<TAccount>;
};

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
    const isBetweenWallets = sourceAccount.account_category === 'wallet' && targetAccount.account_category === 'wallet';
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
                isBetweenWallets ? 'Wallets' : `${sourceAccount.accountName} and ${targetAccount.accountName}`
            }. The limit will reset at 00:00 GMT.`,
            type: 'error' as const,
        };

    if (allowedSumUSD === availableSumUSD)
        return {
            text: `The daily transfer limit between your ${
                isBetweenWallets ? 'Wallets' : `${sourceAccount.accountName} and ${targetAccount.accountName}`
            } is ${formattedSourceCurrencyLimit}${!isSameCurrency ? ` (${formattedTargetCurrencyLimit})` : ''}.`,
            type: sourceAmount > sourceCurrencyRemainder ? ('error' as const) : ('success' as const),
        };

    return {
        text: `The remaining daily transfer limit between ${
            isBetweenWallets ? 'Wallets' : `your ${sourceAccount.accountName} and ${targetAccount.accountName}`
        } is ${formattedSourceCurrencyRemainder}${!isSameCurrency ? ` (${formattedTargetCurrencyRemainder})` : ''}.`,
        type: sourceAmount > sourceCurrencyRemainder ? ('error' as const) : ('success' as const),
    };
};

const useTransferMessages = (
    fromAccount: NonNullable<TAccount> | undefined,
    toAccount: NonNullable<TAccount> | undefined,
    formData: TInitialTransferFormValues
) => {
    const { data: authorizeData } = useAuthorize();
    const { data: activeWallet } = useActiveWalletAccount();
    const { preferred_language: preferredLanguage } = authorizeData;
    const { data: poi } = usePOI();
    const { data: accountLimits } = useAccountLimits();
    const { data: exchangeRatesRaw, subscribe, unsubscribe } = useExchangeRate();

    const [exchangeRates, setExchangeRates] = useState<THooks.ExchangeRate>();

    const isBetweenWallets = fromAccount?.account_category === 'wallet' && toAccount?.account_category === 'wallet';
    const isAccountVerified = poi?.is_verified;

    useEffect(
        () => setExchangeRates(prev => ({ ...prev, rates: { ...prev?.rates, ...exchangeRatesRaw?.rates } })),
        [exchangeRatesRaw?.rates]
    );

    useEffect(() => {
        if (!fromAccount?.currency || !toAccount?.currency || !activeWallet?.currency || !activeWallet?.loginid) return;
        unsubscribe();
        if (!isAccountVerified && isBetweenWallets) {
            subscribe({
                base_currency: activeWallet.currency,
                loginid: activeWallet.loginid,
                target_currency:
                    activeWallet.loginid === fromAccount.loginid ? toAccount.currency : fromAccount.currency,
            });
        } else {
            subscribe({
                base_currency: 'USD',
                loginid: activeWallet.loginid,
                target_currency: toAccount.currency,
            });
            if (fromAccount.currency !== toAccount.currency)
                subscribe({
                    base_currency: 'USD',
                    loginid: activeWallet.loginid,
                    target_currency: fromAccount.currency,
                });
            return unsubscribe;
        }
    }, [
        activeWallet?.currency,
        activeWallet?.loginid,
        fromAccount?.currency,
        fromAccount?.loginid,
        isAccountVerified,
        isBetweenWallets,
        subscribe,
        toAccount?.currency,
        unsubscribe,
    ]);

    const displayMoney = useCallback(
        (amount: number, currency: string, fractionalDigits: number) =>
            displayMoney_(amount, currency, {
                fractional_digits: fractionalDigits,
                preferred_language: preferredLanguage,
            }),
        [preferredLanguage]
    );

    if (!activeWallet || !fromAccount || !toAccount) return [];

    const sourceAmount = formData.fromAmount;

    const messageFns: ((props: TMessageFnProps) => TMessage | null)[] = [];
    const messages: TMessage[] = [];

    if (isAccountVerified || (!isAccountVerified && !isBetweenWallets)) {
        messageFns.push(cumulativeAccountLimitsMessageFn);
    }
    if (!isAccountVerified && isBetweenWallets) {
        messageFns.push(lifetimeAccountLimitsBetweenWalletsMessageFn);
    }

    messageFns.forEach(messageFn => {
        const message = messageFn({
            activeWallet,
            displayMoney,
            exchangeRates,
            limits: accountLimits,
            sourceAccount: fromAccount,
            sourceAmount,
            targetAccount: toAccount,
        });
        if (message) messages.push(message);
    });

    return messages;
};

export default useTransferMessages;
