import React from 'react';
import Routes from 'Containers/routes';
import 'Sass/app.scss';
import initStore from './init-store';
import type { TCoreStores } from '@deriv/stores/types';
import ReportsProviders from './reports-providers';

type TAppProps = {
    passthrough: {
        root_store: TCoreStores;
        WS: unknown;
    };
};

const App = ({ passthrough }: TAppProps) => {
    const root_store = initStore(passthrough.root_store, passthrough.WS);

    return (
        <ReportsProviders store={root_store}>
            <Routes />
        </ReportsProviders>
    );
};

export default App;
