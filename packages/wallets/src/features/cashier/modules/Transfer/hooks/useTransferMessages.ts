import { useCallback, useEffect, useState } from 'react';
import { useAccountLimits, useActiveWalletAccount, useAuthorize, useExchangeRate, usePOI } from '@deriv/api';
import { displayMoney as displayMoney_ } from '@deriv/api/src/utils';
import { THooks } from '../../../../../types';
import { TAccount, TInitialTransferFormValues } from '../types';

type TMessageFnProps = {
    displayMoney?: (amount: number, currency: string, fractionalDigits: number) => string;
    exchangeRates?: THooks.ExchangeRate;
    limits?: THooks.AccountLimits;
    sourceAccount: NonNullable<TAccount>;
    sourceAmount: number;
    targetAccount: NonNullable<TAccount>;
};

// this function in blocked by BE WALL-1440
const unverifiedAccountLimitsBetweenWalletsMessageFn = ({
    displayMoney,
    exchangeRates,
    limits,
    sourceAccount,
    sourceAmount,
    targetAccount,
}: TMessageFnProps) => {
    const sourceWalletType = sourceAccount.account_type === 'crypto' ? 'crypto' : 'fiat';
    const targetWalletType = targetAccount.account_type === 'crypto' ? 'crypto' : 'fiat';
    const limitsCaseKey = `${sourceWalletType}_to_${targetWalletType}` as const;

    //@ts-expect-error needs backend type
    const allowedSumUSD = limits?.lifetime_transfers?.[limitsCaseKey].allowed as number;
    //@ts-expect-error needs backend type
    const availableSumUSD = limits?.lifetime_transfers?.[limitsCaseKey].available as number;

    const formattedAvailableSumUSD = displayMoney?.(availableSumUSD, 'USD', 2);
    const formattedAvailableSumSourceCurrency = displayMoney?.(
        allowedSumUSD / (exchangeRates?.rates?.[sourceAccount?.currency ?? 'USD'] ?? 1),
        sourceAccount.currencyConfig?.display_code ?? '',
        sourceAccount.currencyConfig?.fractional_digits ?? 2
    );

    const condition =
        sourceAccount?.account_category === 'wallet' &&
        targetAccount?.account_category === 'wallet' &&
        allowedSumUSD === availableSumUSD;
    const message = {
        text: `The lifetime transfer limit between cryptocurrency Wallets is up to ${formattedAvailableSumUSD} (${formattedAvailableSumSourceCurrency})`,
        type: sourceAmount > availableSumUSD ? ('error' as const) : ('success' as const),
    };
    return condition ? message : null;
};

const verifiedAccountLimitsMessageFn = ({
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
        !exchangeRates?.rates?.[targetAccount.currency]
    )
        return null;

    const sourceCurrencyLimit = allowedSumUSD * (exchangeRates.rates[sourceAccount.currency] ?? 1);
    const targetCurrencyLimit = allowedSumUSD * (exchangeRates.rates[targetAccount.currency] ?? 1);

    const sourceCurrencyRemainder = availableSumUSD * (exchangeRates.rates[sourceAccount.currency] ?? 1);
    const targetCurrencyRemainder = availableSumUSD * (exchangeRates.rates[targetAccount.currency] ?? 1);

    const formattedSourceCurrencyLimit = displayMoney?.(
        sourceCurrencyLimit,
        sourceAccount.currencyConfig?.display_code ?? 'USD',
        sourceAccount.currencyConfig?.fractional_digits ?? 2
    );
    const formattedTargetCurrencyLimit = displayMoney?.(
        targetCurrencyLimit,
        targetAccount.currencyConfig?.display_code ?? 'USD',
        targetAccount.currencyConfig?.fractional_digits ?? 2
    );

    const formattedSourceCurrencyRemainder = displayMoney?.(
        sourceCurrencyRemainder,
        sourceAccount.currencyConfig?.display_code ?? 'USD',
        sourceAccount.currencyConfig?.fractional_digits ?? 2
    );
    const formattedTargetCurrencyRemainder = displayMoney?.(
        targetCurrencyRemainder,
        targetAccount.currencyConfig?.display_code ?? 'USD',
        targetAccount.currencyConfig?.fractional_digits ?? 2
    );

    if (availableSumUSD === 0)
        return {
            text: `You have reached your daily transfer limit of ${formattedSourceCurrencyLimit}${
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

const UNVERIFIED_ACCOUNT_MESSAGE_FUNCTIONS = [unverifiedAccountLimitsBetweenWalletsMessageFn];

const VERIFIED_ACCOUNT_MESSAGE_FUNCTIONS = [verifiedAccountLimitsMessageFn];

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

    useEffect(
        () => setExchangeRates(prev => ({ ...prev, rates: { ...prev?.rates, ...exchangeRatesRaw?.rates } })),
        [exchangeRatesRaw?.rates]
    );

    useEffect(() => {
        if (!fromAccount?.currency || !toAccount?.currency || !activeWallet?.loginid) return;
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
    }, [activeWallet?.loginid, fromAccount?.currency, subscribe, toAccount?.currency, unsubscribe]);

    const displayMoney = useCallback(
        (amount: number, currency: string, fractionalDigits: number) =>
            displayMoney_(amount, currency, {
                fractional_digits: fractionalDigits,
                preferred_language: preferredLanguage,
            }),
        [preferredLanguage]
    );

    if (!fromAccount || !toAccount) return [];

    const isAccountVerified = poi?.is_verified;

    const sourceAmount = formData.fromAmount;

    const messages: { text: string; type: 'error' | 'success' }[] = [];

    if (!isAccountVerified)
        UNVERIFIED_ACCOUNT_MESSAGE_FUNCTIONS.forEach(messageFn => {
            const message = messageFn({
                displayMoney,
                exchangeRates,
                limits: accountLimits,
                sourceAccount: fromAccount,
                sourceAmount,
                targetAccount: toAccount,
            });
            if (message) messages.push(message);
        });
    else
        VERIFIED_ACCOUNT_MESSAGE_FUNCTIONS.forEach(messageFn => {
            const message = messageFn({
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
