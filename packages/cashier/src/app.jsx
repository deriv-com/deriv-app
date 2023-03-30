import React from 'react';
import { setWebsocket } from '@deriv/shared';
import { init } from 'Utils/server_time';
import CashierProviders from './cashier-providers';
import AppContent from './app-content';

const App = ({ passthrough: { WS, root_store } }) => {
    React.useEffect(() => {
        setWebsocket(WS);
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <CashierProviders store={root_store}>
            <AppContent />
        </CashierProviders>
    );
};

export default App;
