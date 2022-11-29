import React from 'react';
import { setWebsocket } from '@deriv/shared';
import { StoreProvider } from '@deriv/stores';
import { init } from 'Utils/server_time';
import Routes from 'Containers/routes';
import { MobxContentProvider } from 'Stores/connect';

const App = ({ passthrough: { WS, root_store } }) => {
    React.useEffect(() => {
        setWebsocket(WS);
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MobxContentProvider store={root_store}>
            <StoreProvider store={root_store}>
                <Routes />
            </StoreProvider>
        </MobxContentProvider>
    );
};

export default App;
