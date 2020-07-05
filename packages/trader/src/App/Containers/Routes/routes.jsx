import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter, matchPath } from 'react-router';
import Loadable from 'react-loadable';
import { UILoader } from '@deriv/components';
import { routes } from '@deriv/shared';
import BinaryRoutes from 'App/Components/Routes';
import { connect } from 'Stores/connect';

const tradePageMountingMiddleware = (route_to, action, current_pathname, cb) => {
    if (action === 'PUSH' || action === 'POP') {
        // We use matchPath here because on contract route, there will be an ID
        // parameter which matchPath takes into account.
        const is_routing_to_contract = matchPath(route_to.pathname, { path: routes.contract, exact: true });
        const is_routing_from_contract = matchPath(current_pathname, {
            path: routes.contract,
            exact: true,
        });

        cb(
            !!(
                (current_pathname === routes.trade && is_routing_to_contract) ||
                (route_to.pathname === routes.trade && is_routing_from_contract)
            )
        );
    }

    return true;
};

const Error = Loadable({
    loader: () => import(/* webpackChunkName: "error-component" */ 'App/Components/Elements/Errors'),
    loading: UILoader,
    render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} />;
    },
});

class Routes extends React.Component {
    componentDidMount() {
        if (this.props.setPromptHandler) {
            this.props.setPromptHandler(true, (route_to, action) =>
                tradePageMountingMiddleware(
                    route_to,
                    action,
                    this.props.history.location.pathname,
                    this.props.setTradeMountingPolicy
                )
            );
        }
    }

    render() {
        if (this.props.has_error) {
            return <Error {...this.props.error} />;
        }

        return <BinaryRoutes is_logged_in={this.props.is_logged_in} passthrough={this.props.passthrough} />;
    }
}

Routes.propTypes = {
    error: MobxPropTypes.objectOrObservableObject,
    has_error: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_virtual: PropTypes.bool,
    setPromptHandler: PropTypes.func,
};

// need to wrap withRouter around connect
// to prevent updates on <BinaryRoutes /> from being blocked
export default withRouter(
    connect(({ client, common, modules, ui }) => ({
        is_logged_in: client.is_logged_in,
        error: common.error,
        has_error: common.has_error,
        setPromptHandler: ui.setPromptHandler,
        setTradeMountingPolicy: modules.trade.setSkipPrePostLifecycle,
    }))(Routes)
);
