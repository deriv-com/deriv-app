import React from 'react';
import CashierStoreProvider from '@deriv/cashier/src/cashier-providers';
import CFDStoreProvider from '@deriv/cfd/src/cfd-providers';
import { StoreProvider, ExchangeRatesProvider } from '@deriv/stores';
import AppContent from './app-content';
import './app.scss';
import { APIProvider, AuthProvider } from '@deriv/api';

type TProps = {
    passthrough: {
        root_store: React.ComponentProps<typeof StoreProvider>['store'];
    };
};

const App: React.FC<TProps> = ({ passthrough: { root_store } }) => (
    <APIProvider>
        <AuthProvider>
            <CashierStoreProvider store={root_store}>
                <CFDStoreProvider store={root_store}>
                    <StoreProvider store={root_store}>
                        <ExchangeRatesProvider>
                            <AppContent />
                        </ExchangeRatesProvider>
                    </StoreProvider>
                </CFDStoreProvider>
            </CashierStoreProvider>
        </AuthProvider>
    </APIProvider>
);

export default App;
