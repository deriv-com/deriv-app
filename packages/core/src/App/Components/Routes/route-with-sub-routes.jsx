import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { redirectToLogin, removeBranchName, routes, isEmptyObject, default_title } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import Page404 from 'Modules/Page404';
import { connect } from 'Stores/connect';

const RouteWithSubRoutes = route => {
    const validateRoute = pathname => {
        if (pathname.startsWith('/cashier')) {
            return route.path === pathname || !!(route.routes && route.routes.find(r => pathname === r.path));
        }
        return true;
    };

    const renderFactory = props => {
        let result = null;
        if (route.component === Redirect) {
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
            const default_subroute = route.routes ? route.routes.find(r => r.default) : {};
            const has_default_subroute = !isEmptyObject(default_subroute);
            const pathname = removeBranchName(location.pathname).replace(/\/$/, '');
            const is_valid_route = validateRoute(pathname);

            result = (
                <React.Fragment>
                    {has_default_subroute && pathname === route.path && <Redirect to={default_subroute.path} />}
                    {is_valid_route ? (
                        <route.component {...props} routes={route.routes} passthrough={route.passthrough} />
                    ) : (
                        <Page404 />
                    )}
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

export default connect(({ gtm }) => ({
    pushDataLayer: gtm.pushDataLayer,
}))(RouteWithSubRoutes);
