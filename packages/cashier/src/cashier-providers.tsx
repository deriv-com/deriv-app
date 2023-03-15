import React from 'react';
import { StoreProvider, TStores } from '@deriv/stores';
import { CashierStoreProvider } from './stores/useCashierStores';

const CashierProviders = ({ children, store }: React.PropsWithChildren<{ store: TStores }>) => {
    return (
        <StoreProvider store={store}>
            <CashierStoreProvider>{children}</CashierStoreProvider>
        </StoreProvider>
    );
};

export default CashierProviders;
