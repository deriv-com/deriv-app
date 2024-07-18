import React from 'react';
import type { TWebSocket } from 'Types';
import initStore from 'App/init-store';
import type { TCoreStores } from '@deriv/stores/types';
import ModulesProvider from 'Stores/Providers/modules-providers';
import TraderProviders from '../trader-providers';
import { ReportsStoreProvider } from '../../../reports/src/Stores/useReportsStores';
import { NotificationsProvider } from '@deriv-com/quill-ui';
import 'Sass/app.scss';
import '@deriv-com/quill-tokens/dist/quill.css';
import Notifications from './Containers/Notifications';
import Router from './Routes/router';

type Apptypes = {
    passthrough: {
        root_store: TCoreStores;
        WS: TWebSocket;
    };
};

const App = ({ passthrough }: Apptypes) => {
    const root_store = initStore(passthrough.root_store, passthrough.WS);

    React.useEffect(() => {
        return () => root_store.ui.setPromptHandler(false);
    }, [root_store]);

    return (
        <TraderProviders store={root_store}>
            <ReportsStoreProvider>
                <ModulesProvider store={root_store}>
                    <NotificationsProvider>
                        <Notifications />
                        <Router />
                    </NotificationsProvider>
                </ModulesProvider>
            </ReportsStoreProvider>
        </TraderProviders>
    );
};

export default App;
