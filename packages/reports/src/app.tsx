import React from 'react';
import { APIProvider } from '@deriv/api';
import { StoreProvider } from '@deriv/stores';
import type { TCoreStores } from '@deriv/stores/types';
import Routes from 'Containers/routes';
import { MobxContentProvider } from 'Stores/connect';
import initStore from './init-store';
import 'Sass/app.scss';

type TAppProps = {
    passthrough: {
        root_store: TCoreStores;
        WS: unknown;
    };
};

const App = ({ passthrough }: TAppProps) => {
    const root_store = initStore(passthrough.root_store, passthrough.WS);

    return (
        <MobxContentProvider store={root_store}>
            <APIProvider>
                <StoreProvider store={passthrough.root_store}>
                    <Routes />
                </StoreProvider>
            </APIProvider>
        </MobxContentProvider>
    );
};

export default App;
