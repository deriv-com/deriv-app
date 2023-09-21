import { initSurvicate } from '../public-path';
import React from 'react';
import { TStores } from '@deriv/stores/types';
import type { TWebSocket } from 'Types';
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
        initSurvicate();
        return () => {
            const survicate_box = document.getElementById('survicate-box') || undefined;
            if (survicate_box) {
                survicate_box.style.display = 'none';
            }
        };
    }, []);

    return (
        <DBotProviders store={root_store} WS={WS}>
            <AppContent />
        </DBotProviders>
    );
};

export default App;
