import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react';
import RootStore from './root-store';

const DbotStoreContext = createContext<RootStore | null>(null);

const DbotStoreProvider = ({ children, store }: PropsWithChildren<{ store: RootStore }>) => {
    const memoizedValue = useMemo(
        () => ({
            ...store,
        }),
        [store]
    );

    return <DbotStoreContext.Provider value={memoizedValue}>{children}</DbotStoreContext.Provider>;
};

const useDbotStore = () => {
    const store = useContext(DbotStoreContext);

    if (!store) {
        throw new Error('useDbotStore must be used within DbotStoreContext');
    }

    return store;
};

export { DbotStoreProvider, useDbotStore };
