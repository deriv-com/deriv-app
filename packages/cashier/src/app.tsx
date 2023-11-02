import React from 'react';
import AppContent from './app-content';
import CashierProviders from './cashier-providers';
import GlobalDataWrapper from '@deriv/hooks/src/Context/global-context';

type TProps = { passthrough: { root_store: React.ComponentProps<typeof CashierProviders>['store'] } };

const App: React.FC<TProps> = ({ passthrough: { root_store } }) => {
    return (
        <CashierProviders store={root_store}>
            <GlobalDataWrapper>
                <AppContent />
            </GlobalDataWrapper>
        </CashierProviders>
    );
};

export default App;
