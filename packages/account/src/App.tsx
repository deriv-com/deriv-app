import React from 'react';
import Routes from './Containers/routes';
import ResetTradingPassword from './Containers/reset-trading-password';
import { setWebsocket } from '@deriv/shared';
import { StoreProvider } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';

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

    return (
        <StoreProvider store={root_store}>
            <Routes />
            <ResetTradingPassword />
        </StoreProvider>
    );
};

export default App;
