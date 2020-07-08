import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import Loadable from 'react-loadable';
import { UILoader } from '@deriv/components';
import BinaryRoutes from 'App/Components/Routes';
import { connect } from 'Stores/connect';

const Error = Loadable({
    loader: () => import(/* webpackChunkName: "error-component" */ 'App/Components/Elements/Errors'),
    loading: UILoader,
    render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} />;
    },
});

class Routes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_bot: false,
        };
    }
    el_landscape_blocker = document.getElementById('landscape_blocker');
    unlisten_to_change = null;
    initial_route = null;

    componentDidMount() {
        this.isBot(window.location);
        if (this.state.is_bot) {
            this.el_landscape_blocker.classList.add('landscape-blocker--keyboard-visible');
        }
        if (!this.unlisten_to_change && !this.initial_route) {
            this.initial_route = this.props.location.pathname;
        }

        this.props.setInitialRouteHistoryItem(this.props.history.location);

        this.unlisten_to_change = this.props.history.listen((route_to, action) => {
            if (action === 'PUSH') this.props.addRouteHistoryItem({ ...route_to, action });
        });

        this.props.setAppRouterHistory(this.props.history);
    }

    componentDidUpdate(pp, ps) {
        if (pp.location.pathname !== this.props.location.pathname) {
            this.isBot(this.props.location);
        }
        if (this.state.is_bot !== ps.is_bot) {
            if (this.state.is_bot) {
                this.removeBlockerEvents();
                this.el_landscape_blocker.classList.add('landscape-blocker--keyboard-visible');
            } else {
                this.addBlockerEvents();
                this.el_landscape_blocker.classList.remove('landscape-blocker--keyboard-visible');
            }
        }
    }

    componentWillUnmount() {
        this.removeBlockerEvents();
        if (typeof this.unlisten_to_change === 'function') {
            this.unlisten_to_change();
            this.unlisten_to_change = null;
            this.initial_route = null;
        }
    }

    isBot = location => {
        const base = location.pathname.split('/')[1];
        this.setState({
            is_bot: base === 'bot',
        });
    };
    addBlockerEvents = () => {
        document.addEventListener('focus', this.onFocus, false);
        document.addEventListener('focusout', this.onFocusOut, false);
        document.addEventListener('touchstart', this.onTouchStart, true);
    };
    removeBlockerEvents = () => {
        document.removeEventListener('focus', this.onFocus);
        document.removeEventListener('focusout', this.onFocusOut);
        document.removeEventListener('touchstart', this.onTouchStart);
    };
    onFocus = () => {
        this.el_landscape_blocker.classList.add('landscape-blocker--keyboard-visible');
        this.props.setIsNativepickerVisible(true);
    };

    onFocusOut = e => {
        if (e.target.classList.contains('dc-dropdown__display')) {
            return;
        }
        this.props.setIsNativepickerVisible(false);
    };

    onTouchStart = () => {
        if (document.activeElement.tagName !== 'INPUT') {
            if (!this.state.is_bot) {
                this.el_landscape_blocker.classList.remove('landscape-blocker--keyboard-visible');
            }
        }
    };

    render() {
        const { error, has_error, is_logged_in, passthrough } = this.props;
        if (has_error) {
            return <Error {...error} />;
        }
        return <BinaryRoutes is_logged_in={is_logged_in} passthrough={passthrough} />;
    }
}

Routes.propTypes = {
    error: MobxPropTypes.objectOrObservableObject,
    has_error: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_virtual: PropTypes.bool,
    setIsNativepickerVisible: PropTypes.func,
};

// need to wrap withRouter around connect
// to prevent updates on <BinaryRoutes /> from being blocked
export default withRouter(
    connect(({ client, common, ui }) => ({
        is_logged_in: client.is_logged_in,
        error: common.error,
        has_error: common.has_error,
        setAppRouterHistory: common.setAppRouterHistory,
        addRouteHistoryItem: common.addRouteHistoryItem,
        setInitialRouteHistoryItem: common.setInitialRouteHistoryItem,
        setIsNativepickerVisible: ui.setIsNativepickerVisible,
    }))(Routes)
);
