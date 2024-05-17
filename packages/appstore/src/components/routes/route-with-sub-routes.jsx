import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { redirectToLogin, isEmptyObject, routes, removeBranchName, default_title } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import Page404 from 'Modules/Page404';

const wallet_routes = [
    routes.wallets,
    routes.wallets_deposit,
    routes.wallets_withdrawal,
    routes.wallets_transfer,
    routes.wallets_transactions,
    routes.wallets_compare_accounts,
    routes.wallets_on_ramp,
    routes.wallets_reset_balance,
];
const RouteWithSubRoutes = route => {
    const validateRoute = pathname => {
        if (pathname === '') return true;
        return route.path === pathname || wallet_routes.some(route => route == pathname);
    };

    const renderFactory = props => {
        let result = null;

        const pathname = removeBranchName(location.pathname);
        const is_valid_route = validateRoute(pathname);

        if (route.component instanceof Redirect) {
            let to = route.to;

            // This if clause has been added just to remove '/index' from url in localhost env.
            if (route.path === routes.index) {
                const { location } = props;
                to = location.pathname.toLowerCase().replace(route.path, '');
            }
            result = <Redirect to={to} />;
        } else if (route.is_authenticated && !route.is_logged_in && !route.is_logging_in) {
            redirectToLogin(route.is_logged_in, getLanguage());
        } else {
            const default_subroute = (route.routes ?? []).reduce(
                (acc, cur) => ({
                    ...acc,
                    ...cur?.subroutes?.find(subroute => subroute.default),
                }),
                {}
            );
            const has_default_subroute = !isEmptyObject(default_subroute);

            result = (
                <React.Fragment>
                    {has_default_subroute && pathname === route.path && <Redirect to={default_subroute.path} />}
                    {is_valid_route ? <route.component {...props} routes={route.routes} /> : <Page404 />}
                </React.Fragment>
            );
        }

        const title = route.getTitle?.() || '';
        document.title = `${title} | ${default_title}`;
        return result;
    };

    return <Route exact={route.exact} path={route.path} render={renderFactory} />;
};

export { RouteWithSubRoutes as RouteWithSubRoutesRender }; // For tests

export default RouteWithSubRoutes;
