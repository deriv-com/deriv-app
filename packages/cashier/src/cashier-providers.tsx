import React from 'react';
import { StoreProvider } from '@deriv/stores';
import { ThemeProvider } from '@deriv/ui';
import { CashierStoreProvider } from './stores/useCashierStores';
import { TRootStore } from 'Types';

const CashierProviders = ({ children, store }: React.PropsWithChildren<{ store: TRootStore }>) => {
    return (
        <ThemeProvider>
            <StoreProvider store={store}>
                <CashierStoreProvider>{children}</CashierStoreProvider>
            </StoreProvider>
        </ThemeProvider>
    );
};

export default CashierProviders;
