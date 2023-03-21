import React from 'react';
import { APIProvider } from '@deriv/api';
import { StoreProvider } from '@deriv/stores';
import { CashierStoreProvider } from './stores/useCashierStores';
import { TRootStore } from 'Types';

const CashierProviders = ({ children, store }: React.PropsWithChildren<{ store: TRootStore }>) => {
    return (
        <StoreProvider store={store}>
            <CashierStoreProvider>
                <APIProvider>{children}</APIProvider>
            </CashierStoreProvider>
        </StoreProvider>
    );
};

export default CashierProviders;
