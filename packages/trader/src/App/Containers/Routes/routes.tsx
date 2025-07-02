import React from 'react';
import { withRouter, matchPath, RouteComponentProps } from 'react-router';
import Loadable from 'react-loadable';
import { UILoader } from '@deriv/components';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import BinaryRoutes from 'App/Components/Routes';
import { useTraderStore } from 'Stores/useTraderStores';

type TMatchPattern = { from: Array<string | undefined>; to: Array<string> };

type TRoutesProps = RouteComponentProps & { passthrough?: React.ComponentProps<typeof BinaryRoutes>['passthrough'] };

type TTradePageMountingMiddlewareParams = {
    action: string;
    callback: (has_match: boolean) => void;
    match_patterns: TMatchPattern[];
    path_from: string;
    path_to: string;
};

export const checkRoutingMatch = (route_list: Array<string | undefined>, path = '/dtrader') => {
    return route_list.some(route => !!matchPath(path, { path: route, exact: true }));
};

export const tradePageMountingMiddleware = ({
    path_from,
    path_to,
    action,
    match_patterns,
    callback,
}: TTradePageMountingMiddlewareParams) => {
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

const ErrorComponent = Loadable({
    loader: () => import(/* webpackChunkName: "error-component" */ 'App/Components/Elements/Errors'),
    loading: () => <UILoader />,
    render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} />;
    },
});

const Routes = observer(({ history, passthrough }: TRoutesProps) => {
    const { client, common, ui, portfolio } = useStore();
    const { setSkipPrePostLifecycle: setTradeMountingPolicy } = useTraderStore();
    const { error, has_error } = common;
    const { onUnmount: onUnmountPortfolio } = portfolio;
    const { is_logged_in, is_logging_in } = client;
    const { setPromptHandler } = ui;

    React.useEffect(() => {
        if (setPromptHandler) {
            setPromptHandler(true, (route_to: RouteComponentProps['location'], action: string) => {
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

    if (has_error) return <ErrorComponent {...error} />;

    return <BinaryRoutes is_logged_in={is_logged_in} is_logging_in={is_logging_in} passthrough={passthrough} />;
});

export default withRouter(Routes);
