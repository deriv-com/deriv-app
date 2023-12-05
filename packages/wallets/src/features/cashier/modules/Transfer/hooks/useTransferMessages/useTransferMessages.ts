import { useCallback, useEffect, useState } from 'react';
import { useAccountLimits, useActiveWalletAccount, useAuthorize, useExchangeRate, usePOI } from '@deriv/api';
import { displayMoney as displayMoney_ } from '@deriv/api/src/utils';
import { THooks } from '../../../../../../types';
import { TAccount, TInitialTransferFormValues } from '../../types';
import {
    cumulativeAccountLimitsMessageFn,
    lifetimeAccountLimitsBetweenWalletsMessageFn,
} from './utils/messageFunctions';
import { TMessage, TMessageFnProps } from './types';

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

    const isTransferBetweenWallets =
        fromAccount?.account_category === 'wallet' && toAccount?.account_category === 'wallet';
    const isAccountVerified = poi?.is_verified;

    useEffect(
        () => setExchangeRates(prev => ({ ...prev, rates: { ...prev?.rates, ...exchangeRatesRaw?.rates } })),
        [exchangeRatesRaw?.rates]
    );

    useEffect(() => {
        if (!fromAccount?.currency || !toAccount?.currency || !activeWallet?.currency || !activeWallet?.loginid) return;
        unsubscribe();
        if (!isAccountVerified && isTransferBetweenWallets) {
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
        isTransferBetweenWallets,
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

    if (isAccountVerified || (!isAccountVerified && !isTransferBetweenWallets)) {
        messageFns.push(cumulativeAccountLimitsMessageFn);
    }
    if (!isAccountVerified && isTransferBetweenWallets) {
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
