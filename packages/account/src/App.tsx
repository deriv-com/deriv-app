import React from 'react';
import { APIProvider } from '@deriv/api';
import { setWebsocket } from '@deriv/shared';
import { StoreProvider } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import { APIProvider } from '@deriv/api';
import Routes from './Containers/routes';
import ResetTradingPassword from './Containers/reset-trading-password';

// TODO: add correct types for WS after implementing them
type TAppProps = {
    passthrough: {
        root_store: TCoreStores;
        WS: Record<string, any>;
    };
};

const App = ({ passthrough }: TAppProps) => {
    const { root_store, WS } = passthrough;
    setWebsocket(WS);

    const { notification_messages_ui: Notifications } = root_store.ui;

    return (
        <APIProvider>
            <StoreProvider store={root_store}>
                {Notifications && <Notifications />}
                <Routes />
                <ResetTradingPassword />
            </StoreProvider>
        </APIProvider>
    );
};

export default App;
