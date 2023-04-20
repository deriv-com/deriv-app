import React, { createContext, PropsWithChildren, useContext } from 'react';
import { useStore } from '@deriv/stores';
import type { TCFDStore } from '../../../../types/cfd-store.types';

const CFDStoreContext = createContext<TCFDStore | null>(null);

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
