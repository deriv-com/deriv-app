import React from 'react';
import Routes from 'Containers/routes.jsx';
import ResetTradingPassword from 'Containers/reset-trading-password.jsx';
import { MobxContentProvider } from 'Stores/connect';
import initStore from 'Stores/init-store';

const App = ({ passthrough }) => {
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
