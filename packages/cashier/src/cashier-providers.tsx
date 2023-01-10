import React from 'react';
import { StoreProvider } from '@deriv/stores';
import { CashierStoreProvider } from './stores/useCashierStores';
import { TRootStore } from './types/stores';

const CashierProviders = ({ children, store }: React.PropsWithChildren<{ store: TRootStore }>) => {
    return (
        <StoreProvider store={store}>
            <CashierStoreProvider>{children}</CashierStoreProvider>
        </StoreProvider>
    );
};

export default CashierProviders;
