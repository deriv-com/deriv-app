import PropTypes from 'prop-types';
import React from 'react';
import { withRouter, matchPath } from 'react-router';
import Loadable from 'react-loadable';
import { UILoader } from '@deriv/components';
import { routes } from '@deriv/shared';
import BinaryRoutes from 'App/Components/Routes';
import getRoutesConfig from 'App/Constants/routes-config';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

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

const Routes = observer(({ history, passthrough }) => {
    const { client, common, ui, portfolio } = useStore();
    const { setSkipPrePostLifecycle: setTradeMountingPolicy } = useTraderStore();
    const { error, has_error } = common;
    const { onUnmount: onUnmountPortfolio } = portfolio;
    const { is_logged_in, is_logging_in } = client;
    const { setPromptHandler } = ui;

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
                                .filter(path => path && path !== routes.mt5),
                            to: [routes.mt5],
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
});

Routes.propTypes = {
    history: PropTypes.object,
    passthrough: PropTypes.object,
};

export default withRouter(Routes);
