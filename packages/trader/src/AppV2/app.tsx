import React from 'react';
import Routes from 'App/Containers/Routes/routes';
import type { TWebSocket } from 'Types';
import initStore from 'App/init-store';
import 'Sass/app.scss';
import type { TCoreStores } from '@deriv/stores/types';
import TraderProviders from '../trader-providers';

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
            <Routes />
        </TraderProviders>
    );
};

export default App;
