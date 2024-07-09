import { useCallback, useEffect, useState } from 'react';
import { useAuthorize, useBalanceSubscription } from '@deriv/api-v2';
import Observable from '../utils/observable';

type TBalance = ReturnType<typeof useBalanceSubscription>['data']['accounts'];

const balanceStore = new Observable<TBalance | undefined>(undefined);

/**
 * Custom hook that manages subscription to balance changes from `balanceStore`.
 * Retrieves initial balance and subscribes to future updates.
 * @returns An object containing the current balance and a function to update it.
 * @example const { data: balanceData, subscribeToAllBalance } = useAllBalanceSubscription();
 */
const useAllBalanceSubscription = () => {
    const [balance, setBalance] = useState(balanceStore.get());
    const {
        data: balanceData,
        isLoading: isBalanceLoading,
        isSubscribed,
        subscribe,
        unsubscribe,
    } = useBalanceSubscription();
    const { isSuccess: isAuthorizeSuccessful } = useAuthorize();
    useEffect(() => {
        return balanceStore.subscribe(setBalance); // subscribe setBalance to the balance store and return the cleanup function
    }, []);

    const subscribeToAllBalance = useCallback(() => {
        if (!isAuthorizeSuccessful) return;
        subscribe({
            account: 'all',
        });
        return () => {
            if (isSubscribed) {
                unsubscribe();
            }
        };
    }, [isSubscribed, isAuthorizeSuccessful, subscribe, unsubscribe]);

    useEffect(() => {
        if (!isAuthorizeSuccessful || isBalanceLoading || Object.entries(balanceData).length === 0) return;
        const existingData = balanceStore.get();
        let newData = balanceData.accounts;
        if (!balanceData.accounts && balanceData.balance !== undefined && balanceData.loginid && balanceData.currency) {
            const { balance, currency, loginid } = balanceData;
            newData = {
                ...existingData,
                [loginid]: {
                    balance,
                    converted_amount: balance,
                    currency,
                    demo_account: existingData?.[loginid]?.demo_account ?? 0,
                    status: existingData?.[loginid]?.status ?? 0,
                    type: existingData?.[loginid]?.type ?? 'deriv',
                },
            };
        }
        balanceStore.set(newData);
    }, [balanceData, isBalanceLoading, isAuthorizeSuccessful]);

    return {
        data: balance,
        isLoading: !balance,
        subscribeToAllBalance,
    };
};

export default useAllBalanceSubscription;
