import React, { useEffect } from 'react';
import { setWebsocket } from '@deriv/shared';
import AppContent from './app-content';
import CashierProviders from './cashier-providers';
import type { TCoreStores } from '@deriv/stores/types';
import type { TWebSocket } from './types';

type TProps = {
    passthrough: {
        WS: TWebSocket;
        root_store: TCoreStores;
    };
};

const App: React.FC<TProps> = ({ passthrough: { WS, root_store } }) => {
    useEffect(() => {
        setWebsocket(WS);
    }, [WS]);

    return (
        <CashierProviders store={root_store}>
            <AppContent />
        </CashierProviders>
    );
};

export default App;
