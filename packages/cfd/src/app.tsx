/* eslint-disable @typescript-eslint/no-explicit-any */
import PropTypes from 'prop-types';
import React from 'react';
import { APIProvider } from '@deriv/api';
import { StoreProvider } from '@deriv/stores';
import Routes from './Containers/routes.jsx';
import { MobxContentProvider } from './Stores/connect';
import initStore from './init-store'; // eslint-disable-line import/extensions

type TAppProps = {
    passthrough: {
        root_store: any;
        WS: any;
    };
};

const App = ({ passthrough }: TAppProps) => {
    const [root_store] = React.useState(initStore(passthrough.root_store, passthrough.WS));

    return (
        <MobxContentProvider store={root_store}>
            <StoreProvider store={root_store}>
                <APIProvider>
                    <React.Fragment>
                        <Routes />
                    </React.Fragment>
                </APIProvider>
            </StoreProvider>
        </MobxContentProvider>
    );
};

App.propTypes = {
    passthrough: PropTypes.shape({
        root_store: PropTypes.object,
        WS: PropTypes.object,
    }),
};

export default App;
