import React, { PropsWithChildren, useEffect, useMemo } from 'react';
import StoreContext from './storeContext';
import { ExchangeRatesStore } from './stores';
import { ExchangeRatesProvider } from './providers';
import type { TCoreStores, TStores } from '../types';

const StoreProvider = ({ children, store }: PropsWithChildren<{ store: TCoreStores }>) => {
    const memoizedValue: TStores = useMemo(
        () => ({
            ...store,
            exchange_rates: new ExchangeRatesStore(),
        }),
        [store]
    );

    useEffect(() => {
        return () => {
            Object.values(memoizedValue).forEach(value => {
                if ('unmount' in value) value.unmount();
            });
        };
    }, [memoizedValue]);

    return (
        <StoreContext.Provider value={memoizedValue}>
            <ExchangeRatesProvider>{children}</ExchangeRatesProvider>
        </StoreContext.Provider>
    );
};

export default StoreProvider;
