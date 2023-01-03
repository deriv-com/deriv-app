import { useStore } from '@deriv/stores';
import React, { createContext, PropsWithChildren, useContext } from 'react';
import CashierStore from './cashier-store';

const CashierStoreContext = createContext<CashierStore | null>(null);

export const CashierStoreProvider = ({ children }: PropsWithChildren) => {
    const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        modules: { cashier },
    } = useStore();
    // const memoizedValue = useMemo(() => new CashierStore(), []);

    return (
        <CashierStoreContext.Provider
            // value={memoizedValue}
            value={cashier}
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
