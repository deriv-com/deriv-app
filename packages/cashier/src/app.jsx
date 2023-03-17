import React from 'react';
import { setWebsocket } from '@deriv/shared';
import { init } from 'Utils/server_time';
import Routes from 'Containers/routes';
import CashierProviders from './cashier-providers';

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
            <Routes />
        </CashierProviders>
    );
};

export default App;
