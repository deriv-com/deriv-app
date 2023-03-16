import React from 'react';
import { StoreProvider } from '@deriv/stores';
import { CashierStoreProvider } from './stores/useCashierStores';
import type { TCoreStores } from '@deriv/stores/types';

const CashierProviders = ({ children, store }: React.PropsWithChildren<{ store: TCoreStores }>) => {
    return (
        <StoreProvider store={store}>
            <CashierStoreProvider>{children}</CashierStoreProvider>
        </StoreProvider>
    );
};

export default CashierProviders;
