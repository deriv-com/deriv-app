import React from 'react';
import { setWebsocket } from '@deriv/shared';
import { init } from 'Utils/server_time';
import Routes from 'Containers/routes';
import CashierProviders from './cashier-providers';
import type { TWebSocket } from './types';
import type { TStores } from '@deriv/stores';

type TAppProps = {
    passthrough: {
        WS: TWebSocket;
        root_store: TStores;
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
