import React from 'react';
import { setWebsocket } from '@deriv/shared';
import { init } from 'Utils/server_time';
import CashierProviders from './cashier-providers';
import AppContent from './app-content';

const App = ({ passthrough: { WS, root_store } }) => {
    const { notification_messages_ui: Notifications } = root_store.ui;

    React.useEffect(() => {
        setWebsocket(WS);
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <CashierProviders store={root_store}>
            {Notifications && <Notifications />}
            <AppContent />
        </CashierProviders>
    );
};

export default App;
