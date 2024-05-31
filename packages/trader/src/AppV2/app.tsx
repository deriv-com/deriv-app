import React from 'react';
import type { TWebSocket } from 'Types';
import initStore from 'App/init-store';
import type { TCoreStores } from '@deriv/stores/types';
import TraderProviders from '../trader-providers';
import BottomNav from './Components/BottomNav';
import Trade from './Containers/Trade';
import Markets from './Containers/Markets';
import Positions from './Containers/Positions';
import Menu from './Containers/Menu';
import { NotificationsProvider } from '@deriv-com/quill-ui';
import 'Sass/app.scss';
import ContractDetails from './Containers/ContractDetails';
import '@deriv-com/quill-tokens/dist/quill.css';
import { useLocation } from 'react-router';
import { Notification } from '@deriv-com/quill-ui/dist/components/Notification/base';

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
    const location = useLocation();
    return (
        <TraderProviders store={root_store}>
            <NotificationsProvider>
                <Notification />
                {location.pathname.includes('/contract/') ? (
                    <ContractDetails />
                ) : (
                    <BottomNav>
                        <Trade />
                        <Markets />
                        <Positions />
                        <Menu />
                    </BottomNav>
                )}
            </NotificationsProvider>
        </TraderProviders>
    );
};

export default App;
