import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { removeBranchName, routes, isEmptyObject, default_title } from '@deriv/shared';
import Page404 from 'Modules/Page404';
import { observer, useStore } from '@deriv/stores';
import { requestOidcAuthentication } from '@deriv-com/auth-client';

const RouteWithSubRoutes = observer(route => {
    const { common, client } = useStore();

    const { checkAppId } = common;
    const { is_single_logging_in, setPreventSingleLogin } = client;

    const validateRoute = pathname => {
        if (pathname.startsWith('/cashier') && !pathname.includes('p2p') && !!route.routes) {
            return route.path === pathname || !!route?.routes.find(({ path }) => pathname === path);
        } else if (pathname.includes('p2p') && !!route.routes) {
            const cashier_subroutes = route?.routes.find(({ path }) => path === '/cashier/p2p');
            const p2p_subroutes =
                pathname === '/cashier/p2p'
                    ? routes.p2p_buy_sell
                    : cashier_subroutes?.routes.find(({ path }) => pathname === path);

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
            checkAppId();
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
                if (!is_single_logging_in) {
                    setTimeout(() => {
                        try {
                            setPreventSingleLogin(true);
                            requestOidcAuthentication({
                                redirectCallbackUri: `${window.location.origin}/callback`,
                                postLoginRedirectUri: window.location.href,
                            }).catch(err => {
                                setPreventSingleLogin(false);
                                // eslint-disable-next-line no-console
                                console.error(err);
                            });
                        } catch (err) {
                            setPreventSingleLogin(false);
                            // eslint-disable-next-line no-console
                            console.error(err);
                        }
                    }, 3000);
                }
            } else if (!is_single_logging_in) {
                try {
                    setPreventSingleLogin(true);
                    requestOidcAuthentication({
                        redirectCallbackUri: `${window.location.origin}/callback`,
                        postLoginRedirectUri: window.location.href,
                    }).catch(err => {
                        setPreventSingleLogin(false);
                        // eslint-disable-next-line no-console
                        console.error(err);
                    });
                } catch (err) {
                    setPreventSingleLogin(true);
                    // eslint-disable-next-line no-console
                    console.error(err);
                }
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

        return result;
    };

    return <Route exact={route.exact} path={route.path} render={renderFactory} />;
});

export default RouteWithSubRoutes;
