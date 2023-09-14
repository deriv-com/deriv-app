import React from 'react';
import { APIProvider } from '@deriv/api';
import { StoreProvider } from '@deriv/stores';
import { ThemeProvider } from '@deriv/ui';
import { CashierStoreProvider } from './stores/useCashierStores';

type TProps = { store: React.ComponentProps<typeof StoreProvider>['store'] };

const CashierProviders: React.FC<React.PropsWithChildren<TProps>> = ({ children, store }) => (
    <APIProvider>
        <StoreProvider store={store}>
            <CashierStoreProvider>
                <ThemeProvider>{children}</ThemeProvider>
            </CashierStoreProvider>
        </StoreProvider>
    </APIProvider>
);

export default CashierProviders;
