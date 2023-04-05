import React, { PropsWithChildren, useEffect, useMemo } from 'react';
import StoreContext from './storeContext';
import { ExchangeRatesStore } from './stores';
import { ExchangeRatesProvider } from './providers';
import type { TRootStore, TStores } from '../types';

const StoreProvider = ({ children, store }: PropsWithChildren<{ store: TRootStore }>) => {
    const memoizedValue: TStores = useMemo(
        () => ({
            ...store,
            exchange_rates: new ExchangeRatesStore(),
        }),
        [store]
    );

    useEffect(() => {
        return () => {
            memoizedValue.exchange_rates.unmount();
        };
    }, [memoizedValue]);

    return (
        <StoreContext.Provider value={memoizedValue}>
            <ExchangeRatesProvider>{children}</ExchangeRatesProvider>
        </StoreContext.Provider>
    );
};

export default StoreProvider;
