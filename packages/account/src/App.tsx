import React from 'react';
import Routes from './Containers/routes';
import ResetTradingPassword from './Containers/reset-trading-password';
import { NetworkStatusToastErrorPopup } from './Containers/toast-popup';
import { APIProvider } from '@deriv/api';
import { StoreProvider } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import { POIProvider } from '@deriv/shared';
import { ThemeProvider } from '@deriv-com/quill-ui';

// TODO: add correct types for WS after implementing them
type TAppProps = {
    passthrough: {
        root_store: TCoreStores;
        WS: Record<string, any>;
    };
};

const App = ({ passthrough }: TAppProps) => {
    const { root_store } = passthrough;

    const { notification_messages_ui: Notifications, is_dark_mode_on } = root_store.ui;

    return (
        <StoreProvider store={root_store}>
            <NetworkStatusToastErrorPopup />
            <APIProvider>
                <POIProvider>
                    <ThemeProvider theme={is_dark_mode_on ? 'dark' : 'light'}>
                        {Notifications && <Notifications />}
                        <Routes />
                        <ResetTradingPassword />
                    </ThemeProvider>
                </POIProvider>
            </APIProvider>
        </StoreProvider>
    );
};

export default App;
