import React from 'react';
import { APIProvider } from '@deriv/api';
import { setWebsocket } from '@deriv/shared';
import { StoreProvider } from '@deriv/stores';
import type { TCoreStores } from '@deriv/stores/types';
import ResetTradingPassword from './Containers/reset-trading-password';
import Routes from './Containers/routes';

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
        <StoreProvider store={root_store}>
            <APIProvider>
                {Notifications && <Notifications />}
                <Routes />
                <ResetTradingPassword />
            </APIProvider>
        </StoreProvider>
    );
};

export default App;
