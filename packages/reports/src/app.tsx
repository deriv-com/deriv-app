import React from 'react';
import Routes from 'Containers/routes';
import { MobxContentProvider } from 'Stores/connect';
import { StoreProvider } from '@deriv/stores';
import 'Sass/app.scss';
import initStore from './init-store';
import type { TCoreStores } from '@deriv/stores/types';

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
            <StoreProvider store={passthrough.root_store}>
                <Routes />
            </StoreProvider>
        </MobxContentProvider>
    );
};

export default App;
