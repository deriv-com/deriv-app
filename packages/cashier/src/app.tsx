import React from 'react';
import AppContent from './app-content';
import CashierProviders from './cashier-providers';
import { P2PSettingsProvider } from '@deriv/stores';

type TProps = { passthrough: { root_store: React.ComponentProps<typeof CashierProviders>['store'] } };

const App: React.FC<TProps> = ({ passthrough: { root_store } }) => {
    return (
        <CashierProviders store={root_store}>
            <P2PSettingsProvider>
                <AppContent />
            </P2PSettingsProvider>
        </CashierProviders>
    );
};

export default App;
