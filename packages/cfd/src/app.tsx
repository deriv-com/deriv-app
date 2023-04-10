/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { StoreProvider } from '@deriv/stores';
import Routes from './Containers/routes.jsx';
import { MobxContentProvider } from './Stores/connect';
import initStore from './init-store'; // eslint-disable-line import/extensions
import { TRootStore } from '@deriv/stores/types';

type TAppProps = {
    passthrough: {
        root_store: TRootStore;
        WS: any;
    };
};

const App = ({ passthrough }: TAppProps) => {
    const [root_store] = React.useState(initStore(passthrough.root_store, passthrough.WS));

    return (
        <MobxContentProvider store={root_store}>
            <StoreProvider store={root_store}>
                <React.Fragment>
                    <Routes />
                </React.Fragment>
            </StoreProvider>
        </MobxContentProvider>
    );
};

export default App;
