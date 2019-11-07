import PropTypes        from 'prop-types';
import React            from 'react';
import Lazy             from 'App/Containers/Lazy';
import Routes           from 'App/Containers/Routes/routes.jsx';
import { MobxProvider } from 'Stores/connect';
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
            <MobxProvider store={ this.root_store }>
                <React.Fragment>
                    <Routes />
                    <Lazy
                        ctor={ () => import(/* webpackChunkName: "modals", webpackPrefetch: true */'./Containers/Modals') }
                        should_load
                        has_progress={ false }
                    />
                </React.Fragment>
            </MobxProvider>
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
