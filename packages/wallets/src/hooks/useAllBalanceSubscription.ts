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
    const { isSuccess: isAuthorizeSuccess } = useAuthorize();
    useEffect(() => {
        return balanceStore.subscribe(setBalance); // subscribe setBalance to the balance store and return the cleanup function
    }, []);

    const subscribeToAllBalance = useCallback(() => {
        if (!isAuthorizeSuccess) return;
        subscribe({
            account: 'all',
        });
    }, [isAuthorizeSuccess, subscribe]);

    useEffect(() => {
        if (!isAuthorizeSuccess || isBalanceLoading || Object.entries(balanceData).length === 0) return; // don't update the balance if the user is not authorized, the balance is loading, or the balance data is empty (i.e. before the call to subscribe is made).
        const oldBalance = balanceStore.get();
        let newBalance = balanceData.accounts;
        if (!balanceData.accounts && balanceData.balance !== undefined && balanceData.loginid && balanceData.currency) {
            const { balance, currency, loginid } = balanceData;
            newBalance = {
                ...oldBalance,
                [loginid]: {
                    balance,
                    converted_amount: balance,
                    currency,
                    demo_account: oldBalance?.[loginid]?.demo_account ?? 0,
                    status: oldBalance?.[loginid]?.status ?? 0,
                    type: oldBalance?.[loginid]?.type ?? 'deriv',
                },
            };
        }
        balanceStore.set(newBalance);
    }, [balanceData, isBalanceLoading, isAuthorizeSuccess]);

    return {
        data: balance,
        isLoading: !balance,
        isSubscribed,
        subscribeToAllBalance,
        unsubscribeFromAllBalance: unsubscribe,
    };
};

export default useAllBalanceSubscription;
