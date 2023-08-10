import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react';
import { DBot } from '@deriv/bot-skeleton';
import { useStore } from '@deriv/stores';
import type { TWebSocket } from 'Types';
import RootStore from './root-store';

const DBotStoreContext = createContext<RootStore | null>(null);

const DBotStoreProvider = ({ children, ws, mock }: PropsWithChildren<{ ws: TWebSocket; mock?: RootStore }>) => {
    const stores = useStore();
    const memoizedValue = useMemo(() => mock || new RootStore(stores, ws, DBot), [mock, stores, ws]);

    return <DBotStoreContext.Provider value={memoizedValue}>{children}</DBotStoreContext.Provider>;
};

const useDBotStore = () => {
    const store = useContext(DBotStoreContext);

    if (!store) {
        throw new Error('useDBotStore must be used within DBotStoreProvider');
    }

    return store;
};

export { DBotStoreProvider, useDBotStore };

export const mockDBotStore = (root_store: ReturnType<typeof useStore>, ws: TWebSocket) =>
    new RootStore(root_store, ws, DBot);
