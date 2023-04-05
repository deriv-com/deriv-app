import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo } from 'react';
import { TRootStore } from '../types';
import ExchangeRatesProvider from './providers/ExchangeRatesProvider';
import { CounterStore, ExchangeRatesStore } from './stores';

export type TStores = TRootStore & {
    exchange_rates: ExchangeRatesStore;
    counter: CounterStore;
};

const StoreContext = createContext<TStores | null>(null);

const StoreProvider = ({ children, store }: PropsWithChildren<{ store: TRootStore }>) => {
    const memoizedValue: TStores = useMemo(
        () => ({
            ...store,
            exchange_rates: new ExchangeRatesStore(),
            counter: new CounterStore(),
        }),
        [store]
    );

    useEffect(() => {
        return () => {
            memoizedValue.exchange_rates.unmount();
            memoizedValue.counter.unmount();
        };
    }, [memoizedValue]);

    return (
        <StoreContext.Provider value={memoizedValue}>
            <ExchangeRatesProvider>{children}</ExchangeRatesProvider>
        </StoreContext.Provider>
    );
};

const useStore = () => {
    const store = useContext(StoreContext);

    if (!store) {
        throw new Error('useStore must be used within StoreContext');
    }

    return store;
};

export { StoreProvider, useStore };
