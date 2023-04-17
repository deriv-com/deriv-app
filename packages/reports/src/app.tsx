import React from 'react';
import Routes from 'Containers/routes';
import { MobxContentProvider } from 'Stores/connect';
import { StoreProvider } from '@deriv/stores';
import 'Sass/app.scss';
import initStore from './init-store'; // eslint-disable-line import/extensions
import type { TStores } from '@deriv/stores';

type TAppProps = {
    passthrough: {
        root_store: TStores;
        WS: Record<string, any>;
    };
};

const App = ({ passthrough }: TAppProps) => {
    const [root_store] = React.useState(initStore(passthrough.root_store, passthrough.WS));

    return (
        <MobxContentProvider store={root_store}>
            <StoreProvider store={root_store}>
                <Routes />
            </StoreProvider>
        </MobxContentProvider>
    );
};

export default App;
