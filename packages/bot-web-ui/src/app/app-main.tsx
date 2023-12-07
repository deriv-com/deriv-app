import React from 'react';
import { TStores } from '@deriv/stores/types';
import type { TWebSocket } from 'Types';
import { setInnerHeightToVariable } from '../utils/window-size';
import AppContent from './app-content';
import DBotProviders from './dbot-providers';

type TAppProps = {
    passthrough: {
        WS: TWebSocket;
        root_store: TStores;
    };
};

const App = ({ passthrough }: TAppProps) => {
    const { root_store, WS } = passthrough;
    React.useEffect(() => {
        setInnerHeightToVariable();
    }, []);

    return (
        <DBotProviders store={root_store} WS={WS}>
            <AppContent />
        </DBotProviders>
    );
};

export default App;
