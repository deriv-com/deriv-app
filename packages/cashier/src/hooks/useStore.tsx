import React, { createContext, PropsWithChildren, useContext } from 'react';
import { TRootStore } from 'Types';

export const StoreContext = createContext<TRootStore | null>(null);

export const StoreProvider = ({ children, store }: PropsWithChildren<{ store: TRootStore }>) => {
    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
    const store = useContext(StoreContext);

    if (!store) {
        throw new Error('useStore must be used within StoreContext');
    }

    return store;
};
