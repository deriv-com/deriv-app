import React from 'react';
import Routes from './Containers/routes';
import ResetTradingPassword from './Containers/reset-trading-password';
import { MobxContentProvider } from './Stores/connect';
import initStore from './Stores/init-store';
import TCoreStore from './Stores/index';

// TODO: add correct types for stores and WS after implementing them
type TAppProps = {
    passthrough: {
        root_store: TCoreStore;
        WS: Record<string, any>;
    };
};

const App = ({ passthrough }: TAppProps) => {
    const { root_store, WS } = passthrough;
    initStore(root_store, WS);

    return (
        <MobxContentProvider store={root_store}>
            <Routes />
            <ResetTradingPassword />
        </MobxContentProvider>
    );
};

export default App;
