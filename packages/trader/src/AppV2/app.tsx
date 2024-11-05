import React from 'react';
import type { TWebSocket } from 'Types';
import initStore from 'App/init-store';
import type { TCoreStores } from '@deriv/stores/types';
import ModulesProvider from 'Stores/Providers/modules-providers';
import TraderProviders from '../trader-providers';
import { ReportsStoreProvider } from '../../../reports/src/Stores/useReportsStores';
import { NotificationsProvider, SnackbarProvider } from '@deriv-com/quill-ui';
import 'Sass/app.scss';
import Notifications from './Containers/Notifications';
import Router from './Routes/router';
import ServicesErrorSnackbar from './Components/ServicesErrorSnackbar';
import { sendDtraderV2OpenToAnalytics } from '../Analytics';

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

    React.useLayoutEffect(() => {
        const head = document.head;
        const links = head.querySelectorAll('link[rel="stylesheet"]');
        const is_last_dtrader = (links[links.length - 1] as HTMLLinkElement)?.href?.includes('/trader');
        const dtrader_links = [...links].filter(link => (link as HTMLLinkElement)?.href?.includes('/trader'));

        if (is_last_dtrader) return;

        const dtrader_links_clone = dtrader_links?.map(link => link?.cloneNode(true));
        dtrader_links_clone.forEach(link => head.appendChild(link));

        return () => dtrader_links_clone?.forEach(link => head.removeChild(link));
    }, []);

    React.useEffect(() => {
        if (!window.location.pathname.startsWith('/contract')) {
            sendDtraderV2OpenToAnalytics();
        }
    }, []);

    return (
        <TraderProviders store={root_store}>
            <ReportsStoreProvider>
                <ModulesProvider store={root_store}>
                    <NotificationsProvider>
                        <SnackbarProvider>
                            <Notifications />
                            <Router />
                            <ServicesErrorSnackbar />
                        </SnackbarProvider>
                    </NotificationsProvider>
                </ModulesProvider>
            </ReportsStoreProvider>
        </TraderProviders>
    );
};

export default App;
