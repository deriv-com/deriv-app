import React, { createContext, PropsWithChildren, useContext } from 'react';
import { TRootStore } from '../types';

const StoreContext = createContext<TRootStore | null>(null);

const StoreProvider = ({ children, store }: PropsWithChildren<{ store: TRootStore }>) => {
    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

const useStore = () => {
    const store = useContext(StoreContext);

    if (!store) {
        throw new Error('useStore must be used within StoreContext');
    }

    return store;
};

export { StoreProvider, useStore };
