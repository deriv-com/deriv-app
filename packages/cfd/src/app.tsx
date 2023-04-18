import React from 'react';
import Routes from './Containers/routes.jsx';
import initStore from './init-store'; // eslint-disable-line import/extensions
import CFDProviders from './cfd-providers';
import type { TCoreStores } from '@deriv/stores/types.js';

type TAppProps = {
    passthrough: {
        root_store: TCoreStores;
        WS: unknown;
    };
};

const App = ({ passthrough }: TAppProps) => {
    const [root_store] = React.useState(initStore(passthrough.root_store, passthrough.WS));

    return (
        <CFDProviders store={root_store}>
            <React.Fragment>
                <Routes />
            </React.Fragment>
        </CFDProviders>
    );
};

export default App;
