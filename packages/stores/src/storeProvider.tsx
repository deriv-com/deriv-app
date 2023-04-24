import React from 'react';
import StoreContext from './storeContext';
import { ExchangeRatesStore } from './stores';
import { ExchangeRatesProvider } from './providers';
import type { TCoreStores, TStores } from '../types';

const StoreProvider = ({ children, store }: React.PropsWithChildren<{ store: TCoreStores }>) => {
    const memoizedValue: TStores = React.useMemo(
        () => ({
            ...store,
            exchange_rates: new ExchangeRatesStore(),
        }),
        [store]
    );

    React.useEffect(() => {
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
