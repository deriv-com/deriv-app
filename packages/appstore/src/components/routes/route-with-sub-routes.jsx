import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { redirectToLogin, isEmptyObject, routes, removeBranchName, default_title } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import Page404 from 'Modules/Page404';

const RouteWithSubRoutes = route => {
    const validateRoute = pathname => {
        if (pathname === '') return true;
        return route.path === pathname || !!pathname.includes('wallet') || !!pathname.includes('compare-accounts');
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
