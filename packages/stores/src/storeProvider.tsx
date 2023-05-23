import React from 'react';
import StoreContext from './storeContext';
import { ExchangeRatesStore, WebsiteStatusStore } from './stores';
import { ExchangeRatesProvider, WebsiteStatusProvider } from './providers';
import type { TCoreStores, TStores } from '../types';

const StoreProvider = ({ children, store }: React.PropsWithChildren<{ store: TCoreStores }>) => {
    const memoizedValue: TStores = React.useMemo(() => {
        // If the store is mocked for testing purposes, then return the mocked value.
        if ('is_mock' in store && store.is_mock) return store as unknown as TStores;

        // Otherwise, instantiate store and return it.
        return {
            ...store,
            exchange_rates: new ExchangeRatesStore(),
            website_status: new WebsiteStatusStore(),
        };
    }, [store]);

    React.useEffect(() => {
        return () => {
            Object.values(memoizedValue).forEach(value => {
                if (typeof value === 'object' && 'unmount' in value) value.unmount();
            });
        };
    }, [memoizedValue]);

    return (
        <StoreContext.Provider value={memoizedValue}>
            <WebsiteStatusProvider>
                <ExchangeRatesProvider>{children}</ExchangeRatesProvider>
            </WebsiteStatusProvider>
        </StoreContext.Provider>
    );
};

export default StoreProvider;
