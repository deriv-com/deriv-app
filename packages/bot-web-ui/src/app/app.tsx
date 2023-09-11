import '../public-path'; // Leave this here (at the top)! OK boss!
import React from 'react';
import type { TRootStore, TWebSocket } from 'Types';
import AppContent from './app-content';
import DBotProviders from './dbot-providers';

type TAppProps = {
    passthrough: {
        WS: TWebSocket;
        root_store: TRootStore;
    };
};

const App = ({ passthrough }: TAppProps) => {
    const { root_store, WS } = passthrough;

    React.useEffect(() => {
        const initSurvicate = () => {
            if (document.getElementById('dbot-survicate')) {
                const survicate_box = document.getElementById('survicate-box') || undefined;
                if (survicate_box) {
                    survicate_box.style.display = 'block';
                }
                return;
            }
            const script = document.createElement('script');
            script.id = 'dbot-survicate';
            script.async = true;
            script.src = 'https://survey.survicate.com/workspaces/83b651f6b3eca1ab4551d95760fe5deb/web_surveys.js';
            document.body.appendChild(script);
        };

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
