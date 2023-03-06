import React from 'react';
import { TRootStore } from '../types';
import { CounterStore } from './stores';

export type TStores = TRootStore & {
    counter: CounterStore;
};

const StoreContext = React.createContext<TStores | null>(null);

const StoreProvider = ({ children, store }: React.PropsWithChildren<{ store: TRootStore }>) => {
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
