import React from 'react';
import { setWebsocket } from '@deriv/shared';
import { init } from 'Utils/server_time';
import CashierProviders from './cashier-providers';
import type { TWebSocket } from './types';
import type { TCoreStores } from '@deriv/stores/types';
import AppContent from './app-content';

type TAppProps = {
    passthrough: {
        WS: TWebSocket;
        root_store: TCoreStores;
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
            <AppContent />
        </CashierProviders>
    );
};

export default App;
