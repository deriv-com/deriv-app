import React, { createContext, PropsWithChildren, useContext } from 'react';
import { useStore } from '@deriv/stores';
import CFDStore from '../cfd-store';

const CFDStoreContext = createContext<CFDStore | null>(null);

export const CFDStoreProvider = ({ children }: PropsWithChildren<unknown>) => {
    const { modules } = useStore();

    return (
        <CFDStoreContext.Provider
            // value={memoizedValue}
            value={modules?.cfd || {}}
        >
            {children}
        </CFDStoreContext.Provider>
    );
};

export const useCfdStore = () => {
    const store = useContext(CFDStoreContext);

    if (!store) {
        throw new Error('useCfdStore must be used within CfdStoreContext');
    }

    return store;
};
