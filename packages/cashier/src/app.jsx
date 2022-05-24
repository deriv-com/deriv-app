import React from 'react';
import { setWebsocket } from '@deriv/shared';
import { init } from '_common/server_time';
import Routes from 'Containers/routes.jsx';
import { MobxContentProvider } from 'Stores/connect';

const App = ({ passthrough: { WS, root_store } }) => {
    React.useEffect(() => {
        setWebsocket(WS);
        init();
    }, []);

    return (
        <MobxContentProvider store={root_store}>
            <Routes />
        </MobxContentProvider>
    );
};

export default App;
