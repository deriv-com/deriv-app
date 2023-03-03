import React from 'react';
import { StoreProvider } from '@deriv/stores';
import { CashierStoreProvider } from './stores/useCashierStores';
import { TRootStore } from 'Types';

const CashierProviders = ({ children, store }: React.PropsWithChildren<{ store: TRootStore }>) => {
    return (
        <StoreProvider store={store}>
            <CashierStoreProvider>{children}</CashierStoreProvider>
        </StoreProvider>
    );
};

export default CashierProviders;
