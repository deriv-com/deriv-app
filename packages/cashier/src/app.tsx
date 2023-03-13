import React from 'react';
import { setWebsocket } from '@deriv/shared';
import { init } from 'Utils/server_time';
import Routes from 'Containers/routes';
import CashierProviders from './cashier-providers';
import type { TRootStore, TWebSocket } from './types';

type TAppProps = {
    passthrough: {
        WS: TWebSocket;
        root_store: TRootStore;
    };
};

const App = ({ passthrough: { WS, root_store } }: TAppProps) => {
    React.useEffect(() => {
        setWebsocket(WS);
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <CashierProviders store={root_store}>
            <Routes />
        </CashierProviders>
    );
};

export default App;
