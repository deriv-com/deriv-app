import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
    alternateLinkTagChange,
    canonicalLinkTagChange,
    redirectToLogin,
    removeBranchName,
    routes,
    isEmptyObject,
    default_title,
} from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import Page404 from 'Modules/Page404';
import { connect } from 'Stores/connect';

const RouteWithSubRoutes = route => {
    const validateRoute = pathname => {
        if (pathname.startsWith('/cashier') && !pathname.startsWith('/cashier/p2p/') && !!route.routes) {
            return route.path === pathname || !!route?.routes.find(r => pathname === r.path);
        } else if (pathname.startsWith('/cashier/p2p/') && !!route.routes) {
            const cashier_subroutes = route?.routes.find(r => r.path === '/cashier/p2p');
            const p2p_subroutes = cashier_subroutes?.routes.find(r => pathname === r.path);

            return route.path === pathname || !!p2p_subroutes;
        }
        return true;
    };

    const renderFactory = props => {
        let result = null;
        const pathname = removeBranchName(location.pathname).replace(/\/$/, '');
        const is_valid_route = validateRoute(pathname);

        // check if by re-rendering content should Platform app_id  change or not,
        if (is_valid_route) {
            route.checkAppId();
        }

        if (route.component === Redirect) {
            let to = route.to;

            // This if clause has been added just to remove '/index' from url in localhost env.
            if (route.path === routes.index) {
                const { location } = props;
                to = location.pathname.toLowerCase().replace(route.path, '');
            }
            result = <Redirect to={to} />;
        } else if (is_valid_route && route.is_authenticated && !route.is_logged_in && !route.is_logging_in) {
            if (window.localStorage.getItem('is_redirecting') === 'true') {
                window.localStorage.removeItem('is_redirecting');
                redirectToLogin(route.is_logged_in, getLanguage(), true, 3000);
            } else {
                redirectToLogin(route.is_logged_in, getLanguage());
            }
        } else {
            const default_subroute = route.routes ? route.routes.find(r => r.default) : {};
            const has_default_subroute = !isEmptyObject(default_subroute);

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

        alternateLinkTagChange();
        canonicalLinkTagChange();

        return result;
    };

    return <Route exact={route.exact} path={route.path} render={renderFactory} />;
};

export default connect(({ gtm, common }) => ({
    pushDataLayer: gtm.pushDataLayer,
    checkAppId: common.checkAppId,
}))(RouteWithSubRoutes);
