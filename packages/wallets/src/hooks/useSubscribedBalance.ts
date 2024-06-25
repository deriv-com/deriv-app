import { useEffect, useMemo, useState } from 'react';
import { useBalanceSubscription } from '@deriv/api-v2';

type TBalance = Omit<
    ReturnType<typeof useBalanceSubscription>,
    'isIdle' | 'isSubscribed' | 'subscribe' | 'unsubscribe' | 'unsubscribe'
>;

type Subscriber<T> = (value: T) => void;
class Observable<T> {
    private subscribers = new Set<Subscriber<T>>();

    constructor(private value: T) {
        this.value = value;
    }

    get(): T {
        return this.value;
    }

    set(newValue: T): void {
        if (JSON.stringify(this.value) === JSON.stringify(newValue)) return; // prevent unnecessary updates, causing infinite re-renders
        this.value = newValue;

        this.subscribers.forEach(listener => listener(this.value)); // notify all subscribers
    }

    subscribe(subscriber: Subscriber<T>): () => void {
        this.subscribers.add(subscriber);

        return () => this.unsubscribe(subscriber); // cleanup function to unsubscribe the subscriber when the component unmounts
    }

    unsubscribe(subscriber: Subscriber<T>): void {
        this.subscribers.delete(subscriber);
    }
}

const balanceStore = new Observable<TBalance | undefined>(undefined);

/**
 * @description Custom hook to subscribe to balance updates
 * @returns {TBalance} balance - The balance data
 */
const useSubscribedBalance = () => {
    const [balance, setBalance] = useState(balanceStore.get());
    useEffect(() => {
        balanceStore.subscribe(setBalance); // subscribe setBalance to the balance store
    }, []);

    const actions = useMemo(() => {
        return {
            setBalanceData: (data: TBalance) => {
                balanceStore.set(data);
            },
        };
    }, []);
    return { ...balance, ...actions };
};

export default useSubscribedBalance;
