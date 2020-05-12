import PropTypes from 'prop-types';
import React from 'react';
import Loadable from 'react-loadable';
import Routes from 'App/Containers/Routes/routes.jsx';
import TradeHeaderExtensions from 'App/Containers/trade-header-extensions.jsx';
import TradeFooterExtensions from 'App/Containers/trade-footer-extensions.jsx';
import TradeSettingsExtensions from 'App/Containers/trade-settings-extensions.jsx';
import { NetworkStatusToastErrorPopup } from 'Modules/Trading/Containers/toast-error-popup.jsx';
import { MobxProvider } from 'Stores/connect';
import initStore from './init-store.js'; // eslint-disable-line import/extensions
import 'Sass/app.scss';

const TradeModals = Loadable({
    loader: () => import(/* webpackChunkName: "trade-modals", webpackPrefetch: true */ './Containers/Modals'),
    loading: () => null,
});

class App extends React.Component {
    constructor(props) {
        super(props);
        // TODO: [trader-remove-client-base] - Refactor codebase to remove usage of ClientBase in Trader
        const {
            passthrough: { WS, root_store, client_base },
        } = props;
        this.root_store = initStore(root_store, WS, client_base);
    }
    render() {
        return (
            <MobxProvider store={this.root_store}>
                <React.Fragment>
                    <Routes />
                    <TradeModals />
                    <NetworkStatusToastErrorPopup />
                    <TradeHeaderExtensions />
                    <TradeFooterExtensions />
                    <TradeSettingsExtensions />
                </React.Fragment>
            </MobxProvider>
        );
    }
}

App.propTypes = {
    passthrough: PropTypes.shape({
        root_store: PropTypes.object,
        WS: PropTypes.object,
    }),
};

export default App;
