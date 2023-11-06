import React from 'react';
import Routes from 'Containers/routes';
import ReportsProviders from './reports-providers';
import 'Sass/app.scss';
import type { TCoreStores } from '@deriv/stores/types';

type TAppProps = {
    passthrough: {
        root_store: TCoreStores;
    };
};

const App = ({ passthrough }: TAppProps) => {
    return (
        <ReportsProviders store={passthrough.root_store}>
            <Routes />
        </ReportsProviders>
    );
};

export default App;
