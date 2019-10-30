import PropTypes        from 'prop-types';
import React            from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { MobxProvider } from 'Stores/connect';
import Routes           from './Containers/Routes/routes.jsx';
// eslint-disable-next-line import/extensions
import initStore        from './init-store.js';
import './i18n';
// eslint-disable-next-line import/no-unresolved
import 'Sass/app.scss';

class App extends React.Component {
    constructor(props) {
        super(props);
        // TODO: [trader-remove-client-base] - Refactor codebase to remove usage of ClientBase in Trader
        const { passthrough: { WS, root_store, client_base } } = props;
        this.root_store = initStore(root_store, WS, client_base);
    }

    render() {
        return (
            <Router>
                <MobxProvider store={ this.root_store }>
                    <Routes />
                </MobxProvider>
            </Router>
        );
    }
}

App.propTypes = {
    passthrough: PropTypes.shape({
        root_store: PropTypes.object,
        WS        : PropTypes.object,
    }),
};

export default App;
