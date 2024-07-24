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
        // Setting the inner height of the document to the --vh variable to fix the issue
        // of dynamic view height(vh) on mobile browsers for few scrollable components
        const vh = window.innerHeight;
        document.body.style.setProperty('--vh', `${vh}px`);

        // eslint-disable-next-line no-console
        console.info("This test link is generated only for testing purpose and shouldn't be merged");
    }, []);

    return (
        <DBotProviders store={root_store} WS={WS}>
            <AppContent />
        </DBotProviders>
    );
};

export default App;
