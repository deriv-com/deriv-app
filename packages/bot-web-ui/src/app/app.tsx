import '../public-path'; // Leave this here (at the top)! OK boss!
import React from 'react';
import AppContent from './app-content';
import type { TWebSocket, TRootStore } from 'Types';
import DBotProviders from './dbot-providers';

type TAppProps = {
    passthrough: {
        WS: TWebSocket;
        root_store: TRootStore;
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
