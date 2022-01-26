import { PropTypes as MobxPropTypes } from 'mobx-react';
import React from 'react';
import { withRouter, matchPath } from 'react-router';
import Loadable from 'react-loadable';
import { UILoader } from '@deriv/components';
import { routes } from '@deriv/shared';
import BinaryRoutes from 'App/Components/Routes';
import getRoutesConfig from 'App/Constants/routes-config';
import { connect } from 'Stores/connect';

type RoutesProps = {
    error: unknown;
    has_error: boolean;
    history: unknown;
    is_logged_in: boolean;
    is_logging_in: boolean;
    passthrough: unknown;
    setPromptHandler: () => void;
    setTradeMountingPolicy: () => void;
};

const checkRoutingMatch = (route_list, path) => {
    return route_list.some(route => !!matchPath(path, { path: route, exact: true }));
};

const tradePageMountingMiddleware = ({ path_from, path_to, action, match_patterns, callback }) => {
    if (action === 'PUSH' || action === 'POP') {
        // We use matchPath here because on route, there will be extra
        // parameters which matchPath takes into account.
        const has_match = match_patterns.some(
            pattern => checkRoutingMatch(pattern.from, path_from) && checkRoutingMatch(pattern.to, path_to)
        );

        callback(has_match);
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

const Routes = ({
    onUnmountPortfolio,
    error,
    has_error,
    history,
    is_logged_in,
    is_logging_in,
    passthrough,
    setPromptHandler,
    setTradeMountingPolicy,
}: RoutesProps) => {
    React.useEffect(() => {
        if (setPromptHandler) {
            setPromptHandler(true, (route_to, action) => {
                // clears portfolio when we navigate to mt5 dashboard
                tradePageMountingMiddleware({
                    path_from: history.location.pathname,
                    path_to: route_to.pathname,
                    match_patterns: [
                        {
                            from: getRoutesConfig()
                                .flatMap(route => {
                                    if (route.routes) {
                                        return route.routes.map(subroute => subroute.path);
                                    }
                                    return [route.path];
                                })
                                .filter(path => path && path !== routes.mt5 && path !== routes.dxtrade),
                            to: [routes.mt5, routes.dxtrade],
                        },
                    ],
                    action,
                    callback: has_match => {
                        if (has_match) {
                            onUnmountPortfolio();
                        }
                    },
                });

                return tradePageMountingMiddleware({
                    path_from: history.location.pathname,
                    path_to: route_to.pathname,
                    match_patterns: [
                        { from: [routes.contract], to: [routes.trade] },
                        { from: [routes.trade], to: [routes.contract] },
                    ],
                    action,
                    callback: setTradeMountingPolicy,
                });
            });
        }

        return () => {
            setPromptHandler?.(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        return () => onUnmountPortfolio();
    }, [onUnmountPortfolio]);

    if (has_error) return <Error {...error} />;

    return <BinaryRoutes is_logged_in={is_logged_in} is_logging_in={is_logging_in} passthrough={passthrough} />;
};

// need to wrap withRouter around connect
// to prevent updates on <BinaryRoutes /> from being blocked
export default withRouter(
    connect(({ client, common, modules, ui }) => ({
        onUnmountPortfolio: modules.portfolio.onUnmount,
        error: common.error,
        has_error: common.has_error,
        is_logged_in: client.is_logged_in,
        is_logging_in: client.is_logging_in,
        setPromptHandler: ui.setPromptHandler,
        setTradeMountingPolicy: modules.trade.setSkipPrePostLifecycle,
    }))(Routes)
);
