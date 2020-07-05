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
    unlisten_to_change = null;
    initial_route = null;

    componentDidMount() {
        if (!this.unlisten_to_change && !this.initial_route) {
            this.initial_route = this.props.location.pathname;
        }

        this.props.setInitialRouteHistoryItem(this.props.history.location);

        this.unlisten_to_change = this.props.history.listen((route_to, action) => {
            if (action === 'PUSH') this.props.addRouteHistoryItem({ ...route_to, action });
        });

        this.props.setAppRouterHistory(this.props.history);
    }

    componentWillUnmount() {
        if (typeof this.unlisten_to_change === 'function') {
            this.unlisten_to_change();
            this.unlisten_to_change = null;
            this.initial_route = null;
        }
    }
    componentDidUpdate() {
        const l = window.location;
        const base = l.pathname.split('/')[1];
        const el_landscape_blocker = document.getElementById('landscape_blocker');
        const onFocus = () => {
            /* Prevent from showing Landscape blocker UI when keyboard is visible */
            el_landscape_blocker.classList.add('landscape-blocker--keyboard-visible');
            this.props.setIsNativepickerVisible(true);
        };

        const onFocusOut = e => {
            if (e.target.classList.contains('dc-dropdown__display')) {
                // if the next target is a dropdown, keep native picker open
                return;
            }
            this.props.setIsNativepickerVisible(false);
        };

        const onTouchStart = () => {
            if (document.activeElement.tagName !== 'INPUT') {
                el_landscape_blocker.classList.remove('landscape-blocker--keyboard-visible');
            }
        };

        if (this.props.isMobile) {
            if (base === 'bot') {
                document.removeEventListener('focus', onFocus);
                document.removeEventListener('focusout', onFocusOut);
                document.removeEventListener('touchstart', onTouchStart);
                el_landscape_blocker.classList.add('landscape-blocker--keyboard-visible');
            } else {
                el_landscape_blocker.classList.remove('landscape-blocker--keyboard-visible');
                document.removeEventListener('focus', onFocus);
                document.addEventListener('focusout', onFocusOut, false);
                document.addEventListener('touchstart', onTouchStart, true);
            }
        }
    }

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
