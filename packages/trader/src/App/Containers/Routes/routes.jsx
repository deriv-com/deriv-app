import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter, matchPath, Prompt } from 'react-router';
import Loadable from 'react-loadable';
import { UILoader } from '@deriv/components';
import BinaryRoutes from 'App/Components/Routes';
import AppRoutes from 'Constants/routes';
import { connect } from 'Stores/connect';

const tradePageMountingMiddleware = (route_to, action, current_pathname, cb) => {
    if (action === 'PUSH' || action === 'POP') {
        // We use matchPath here because on contract route, there will be an ID
        // parameter which matchPath takes into account.
        const is_routing_to_contract = matchPath(route_to.pathname, { path: AppRoutes.contract, exact: true });
        const is_routing_from_contract = matchPath(current_pathname, {
            path: AppRoutes.contract,
            exact: true,
        });

        cb(
            !!(
                (current_pathname === AppRoutes.trade && is_routing_to_contract) ||
                (route_to.pathname === AppRoutes.trade && is_routing_from_contract)
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

const Routes = props => {
    if (props.has_error) {
        return <Error {...props.error} />;
    }

    return (
        <>
            <Prompt
                when
                message={(route_to, action) =>
                    tradePageMountingMiddleware(
                        route_to,
                        action,
                        props.history.location.pathname,
                        props.setTradeMountingPolicy
                    )
                }
            />
            <BinaryRoutes is_logged_in={props.is_logged_in} passthrough={props.passthrough} />
        </>
    );
};

Routes.propTypes = {
    error: MobxPropTypes.objectOrObservableObject,
    has_error: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_virtual: PropTypes.bool,
};

// need to wrap withRouter around connect
// to prevent updates on <BinaryRoutes /> from being blocked
export default withRouter(
    connect(({ client, common, modules }) => ({
        is_logged_in: client.is_logged_in,
        error: common.error,
        has_error: common.has_error,
        setTradeMountingPolicy: modules.trade.setSkipPrePostLifecycle,
    }))(Routes)
);
