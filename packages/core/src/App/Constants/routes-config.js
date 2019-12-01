import { lazy }                       from 'react';
import { Redirect as RouterRedirect } from 'react-router-dom';
import { Redirect }                   from 'App/Containers/Redirect';
import { localize }                   from 'deriv-translations';
import { routes }                     from 'Constants';
import { isBot }                      from 'Utils/PlatformSwitcher';
import { getUrlBase }                 from '_common/url';

export const interceptAcrossBot = (route_to, action) => {
    const is_routing_to_bot = route_to.pathname.startsWith(routes.bot);

    if (
        action === 'PUSH' &&
        (
            (!isBot() && is_routing_to_bot)
            ||
            (isBot() && !is_routing_to_bot)
        )
    ) {
        window.location.href = getUrlBase(route_to.pathname); // If url base exists, use pathname with base

        return false;
    }

    return true;
};

// Error Routes
const Page404 = lazy(() => import(/* webpackChunkName: "404" */ 'Modules/Page404'));

const Trader = lazy(() => {
    const el_head = document.querySelector('head');
    const el_main_css = document.createElement('link');
    el_main_css.href = '/css/trader.main.css';
    el_main_css.rel = 'stylesheet';
    el_main_css.type = 'text/css';
    el_head.appendChild(el_main_css);
    // eslint-disable-next-line import/no-unresolved
    return import(/* webpackChunkName: "trader" */ 'deriv-trader');
});

const Bot = lazy(() => {
    const el_head = document.querySelector('head');
    const el_scratch_js = document.createElement('script');
    el_scratch_js.src = '/js/bot/scratch.min.js';
    el_head.appendChild(el_scratch_js);
    // eslint-disable-next-line import/no-unresolved
    return import(/* webpackChunkName: "bot" */ 'deriv-bot');
});

// TODO: search tag: test-route-parent-info -> Enable test for getting route parent info when there are nested routes
const initRoutesConfig = () => ([
    { path: routes.index,     component: RouterRedirect, title: '',                                     to: routes.root },
    { path: routes.redirect,  component: Redirect,       title: localize('Redirect') },
    { path: routes.bot,       component: Bot,            title: localize('Bot') },
    {
        path     : routes.root,
        component: Trader,
        title    : localize('Trader'),
        routes   : [
            { path: routes.mt5,      component: Trader, title: localize('MT5'),                 is_authenticated: true },
            { path: routes.reports,  component: Trader, title: localize('Reports'),             is_authenticated: true },
            { path: routes.account,  component: Trader, title: localize('Accounts management'), is_authenticated: true },
            { path: routes.contract, component: Trader, title: localize('Contract Details'),    is_authenticated: true },
            { path: routes.error404, component: Trader, title: localize('Error 404') },
        ],
    },
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
