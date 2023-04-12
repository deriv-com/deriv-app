import React from 'react';
import { CounterStore } from './stores';
import type { TCoreStores } from '../types';

export type TStores = TCoreStores & {
    counter: CounterStore;
};

const StoreContext = React.createContext<TStores | null>(null);

const StoreProvider = ({ children, store }: React.PropsWithChildren<{ store: TCoreStores }>) => {
    const memoizedValue = React.useMemo(
        () => ({
            ...store,
            counter: new CounterStore(),
        }),
        [store]
    );

    React.useEffect(() => {
        return () => {
            return memoizedValue.counter.unmount();
        };
    }, [memoizedValue]);

    return <StoreContext.Provider value={memoizedValue}>{children}</StoreContext.Provider>;
};

const useStore = () => {
    const store = React.useContext(StoreContext);

    if (!store) {
        throw new Error('useStore must be used within StoreContext');
    }

    return store;
};

export { StoreProvider, useStore };
