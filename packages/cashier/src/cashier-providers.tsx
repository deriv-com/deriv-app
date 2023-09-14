import React from 'react';
import { APIProvider } from '@deriv/api';
import { StoreProvider } from '@deriv/stores';
import { ThemeProvider } from '@deriv/ui';
import { CashierStoreProvider } from './stores/useCashierStores';

type TProps = { store: React.ComponentProps<typeof StoreProvider>['store'] };

const CashierProviders: React.FC<React.PropsWithChildren<TProps>> = ({ children, store }) => (
    <StoreProvider store={store}>
        <CashierStoreProvider>
            <APIProvider>
                <ThemeProvider>{children}</ThemeProvider>
            </APIProvider>
        </CashierStoreProvider>
    </StoreProvider>
);

export default CashierProviders;
