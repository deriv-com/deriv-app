import React from 'react';
import Routes from './Containers/routes';
import ResetTradingPassword from './Containers/reset-trading-password';
import { TCoreStores } from '@deriv/stores/types';
import { StoreProvider } from '@deriv/stores';

// TODO: add correct types for stores and WS after implementing them
type TAppProps = {
    passthrough: {
        root_store: TCoreStores | any;
        WS: Record<string, any>;
    };
};

const App = ({ passthrough }: TAppProps) => {
    const { root_store } = passthrough;

    return (
        <StoreProvider store={root_store}>
            <Routes />
            <ResetTradingPassword />
        </StoreProvider>
    );
};

export default App;
