import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo } from 'react';
import { CounterStore } from './stores';
import type { TCoreStores } from '../types';

export type TStores = TCoreStores & {
    counter: CounterStore;
};

const StoreContext = createContext<TStores | null>(null);

const StoreProvider = ({ children, store }: PropsWithChildren<{ store: TCoreStores }>) => {
    const memoizedValue = useMemo(
        () => ({
            ...store,
            counter: new CounterStore(),
        }),
        [store]
    );

    useEffect(() => {
        return () => {
            return memoizedValue.counter.unmount();
        };
    }, [memoizedValue]);

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
