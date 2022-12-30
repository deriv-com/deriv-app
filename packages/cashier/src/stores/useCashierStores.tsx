import { useStore } from '@deriv/stores';
import React, { createContext, PropsWithChildren, useContext } from 'react';
import CashierStore from './cashier-store';

const CashierStoreContext = createContext<CashierStore | null>(null);

export const CashierStoreProvider = ({ children }: PropsWithChildren) => {
    // TODO: Once we removed instantiating the CashierStore in the core package, We should instantiate it here instead.
    const stores = useStore();
    // const memoizedValue = useMemo(() => new CashierStore(), []);

    return (
        <CashierStoreContext.Provider
            // value={memoizedValue}
            value={stores.modules.cashier}
        >
            {children}
        </CashierStoreContext.Provider>
    );
};

export const useCashierStore = () => {
    const store = useContext(CashierStoreContext);

    if (!store) {
        throw new Error('useCashierStore must be used within CashierStoreContext');
    }

    return store;
};
