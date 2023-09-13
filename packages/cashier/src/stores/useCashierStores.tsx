import React, { createContext, useContext } from 'react';
import { useStore } from '@deriv/stores';
import CashierStore from './cashier-store';

const CashierStoreContext = createContext<CashierStore | null>(null);

export const CashierStoreProvider: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
    const { modules } = useStore();

    return <CashierStoreContext.Provider value={modules?.cashier}>{children}</CashierStoreContext.Provider>;
};

export const useCashierStore = () => {
    const store = useContext(CashierStoreContext);

    if (!store) {
        throw new Error('useCashierStore must be used within CashierStoreContext');
    }

    return store;
};
