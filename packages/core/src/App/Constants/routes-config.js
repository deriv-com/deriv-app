import { lazy }                       from 'react';
import { Redirect as RouterRedirect } from 'react-router-dom';
import { Redirect }                   from 'App/Containers/Redirect';
import { localize }                   from 'App/i18n';
import { routes }                     from 'Constants';

// Error Routes
const Page404 = lazy(() => import(/* webpackChunkName: "404" */ 'Modules/Page404'));

const Bot = lazy(() => import(/* webpackChunkName: "bot" */ 'deriv-bot'));

// TODO: search tag: test-route-parent-info -> Enable test for getting route parent info when there are nested routes
const initRoutesConfig = () => ([
    { path: routes.index,     component: RouterRedirect,  title: '',                   to: routes.root },
    { path: routes.root,      component: Bot,             title: localize('Trade'),    exact: true },
    { path: routes.error404,  component: Page404,         title: localize('Error 404') },
    { path: routes.redirect,  component: Redirect,        title: localize('Redirect') },
]);

let routesConfig;

// For default page route if page/path is not found, must be kept at the end of routes_config array
const route_default  = { component: Page404, title: localize('Error 404') };

const getRoutesConfig = () => {
    if (!routesConfig) {
        routesConfig = initRoutesConfig();
    }
    routesConfig.push(route_default);
    return routesConfig;
};

export default getRoutesConfig;
