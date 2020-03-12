import PropTypes from 'prop-types';
import React from 'react';
import { isMobile } from '@deriv/shared/utils/screen';
import Lazy from 'App/Containers/Lazy';
import Routes from 'App/Containers/Routes/routes.jsx';
import TradeHeaderExtensions from 'App/Containers/trade-header-extensions.jsx';
import TradeFooterExtensions from 'App/Containers/trade-footer-extensions.jsx';
import TradeSettingsExtensions from 'App/Containers/trade-settings-extensions.jsx';
import { NetworkStatusToastErrorPopup } from 'Modules/Trading/Containers/toast-error-popup.jsx';
import { MobxProvider } from 'Stores/connect';
import initStore from './init-store.js'; // eslint-disable-line import/extensions
import 'Sass/app.scss';

class App extends React.Component {
    constructor(props) {
        super(props);
        // TODO: [trader-remove-client-base] - Refactor codebase to remove usage of ClientBase in Trader
        const {
            passthrough: { WS, root_store, client_base },
        } = props;
        this.root_store = initStore(root_store, WS, client_base);
    }

    componentDidMount() {
        if (isMobile()) {
            /* Prevent from showing Landscape blocker UI when keyboard is visible */
            this.el_landscape_blocker = document.getElementById('landscape_blocker');
            document.addEventListener('focus', this.onFocus, true);
            document.addEventListener('touchstart', this.onTouchStart, true);
        }
    }

    componentWillUnmount() {
        if (isMobile()) {
            document.removeEventListener('focus', this.onFocus);
            document.removeEventListener('touchstart', this.onTouchStart);
        }
    }

    onFocus = () => {
        this.el_landscape_blocker.classList.add('landscape-blocker--keyboard-visible');
    };

    onTouchStart = () => {
        if (document.activeElement.tagName !== 'INPUT') {
            this.el_landscape_blocker.classList.remove('landscape-blocker--keyboard-visible');
        }
    };

    render() {
        return (
            <MobxProvider store={this.root_store}>
                <React.Fragment>
                    <Routes />
                    <Lazy
                        ctor={() =>
                            import(/* webpackChunkName: "trade-modals", webpackPrefetch: true */ './Containers/Modals')
                        }
                        should_load
                        has_progress={false}
                    />
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
