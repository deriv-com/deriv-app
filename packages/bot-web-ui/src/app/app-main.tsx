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

const originToDomainMap = {
    'staging-app.deriv.com': 'staging-dbot.deriv.com',
    'staging-app.deriv.me': 'staging-dbot.deriv.com',
    'staging-app.deriv.be': 'staging-dbot.deriv.com',
    'app.deriv.com': 'dbot.deriv.com',
    'app.deriv.me': 'dbot.deriv.me',
    'app.deriv.be': 'dbot.deriv.be',
};

const App = ({ passthrough }: TAppProps) => {
    // Extract the correct domain based on the current origin
    const targetDomain = Object.entries(originToDomainMap).find(([origin]) =>
        window.location.origin.includes(origin)
    )?.[1];

    // Redirect to the dbot.deriv.com only from staging and production
    if (targetDomain) {
        window.location.assign(`https://${targetDomain}`);
    }

    const { root_store, WS } = passthrough;
    React.useEffect(() => {
        // Setting the inner height of the document to the --vh variable to fix the issue
        // of dynamic view height(vh) on mobile browsers for few scrollable components
        const vh = window.innerHeight;
        document.body.style.setProperty('--vh', `${vh}px`);

        initSurvicate();
        return () => {
            const survicate_box = document.getElementById('survicate-box');
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
