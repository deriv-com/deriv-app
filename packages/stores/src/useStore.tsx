import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react';
import { TRootStore } from '../types';
import { CounterStore } from './stores';

export type TStores = TRootStore & {
    counter: CounterStore;
};

const StoreContext = createContext<TStores | null>(null);

const StoreProvider = ({ children, store }: PropsWithChildren<{ store: TRootStore }>) => {
    const memoizedValue = useMemo(
        () => ({
            ...store,
            counter: new CounterStore(),
        }),
        [store]
    );

    return <StoreContext.Provider value={memoizedValue}>{children}</StoreContext.Provider>;
};

const useStore = () => {
    const store = useContext(StoreContext);

    if (!store) {
        throw new Error('useStore must be used within StoreContext');
    }

    return store;
};

export { StoreProvider, useStore };
