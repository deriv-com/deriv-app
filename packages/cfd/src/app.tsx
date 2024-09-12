import React from 'react';
import Routes from './Containers/routes';
import initStore from './init-store';
import CFDProviders from './cfd-providers';
import type { TCoreStores } from '@deriv/stores/types';

type TAppProps = {
    passthrough: {
        root_store: TCoreStores;
        WS: unknown;
    };
};

const App = ({ passthrough }: TAppProps) => {
    initStore(passthrough.root_store, passthrough.WS);

    return (
        <CFDProviders store={passthrough.root_store}>
            <Routes />
        </CFDProviders>
    );
};

export default App;
