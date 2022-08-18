import PropTypes from 'prop-types';
import React from 'react';
import Routes from 'Containers/routes.jsx';
import { MobxContentProvider } from 'Stores/connect';
import 'Sass/app.scss';
import initStore from './init-store'; // eslint-disable-line import/extensions

const App = ({ passthrough }) => {
    const [root_store] = React.useState(initStore(passthrough.root_store, passthrough.WS));

    return (
        <MobxContentProvider store={root_store}>
            <React.Fragment>
                <Routes />
            </React.Fragment>
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
