import '../public-path'; // Leave this here (at the top)! OK boss!
import React from 'react';
import AppContent from './app-content';
import { TWebSocket } from 'Types';
import DBotProviders from './dbot-providers';
import type { TCoreStores } from '@deriv/stores/types';

type TAppProps = {
    passthrough: {
        WS: TWebSocket;
        root_store: TCoreStores;
    };
};

const App = ({ passthrough }: TAppProps) => {
    const { root_store, WS } = passthrough;

    return (
        <DBotProviders store={root_store} WS={WS}>
            <AppContent />
        </DBotProviders>
    );
};

export default App;
