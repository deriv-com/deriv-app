import React, { lazy }                from 'react';
import { Prompt }                     from 'react-router';
import { Redirect as RouterRedirect } from 'react-router-dom';
import { Redirect }                   from 'App/Containers/Redirect';
import { localize }                   from 'App/i18n';
import { routes }                     from 'Constants';

const interceptAcrossBot = (route_to, action) => {
    const is_bot = window.location.pathname.startsWith(routes.bot);
    const is_routing_to_bot = route_to.pathname.startsWith(routes.bot);

    if (
        action === 'PUSH' &&
        (
            (!is_bot && is_routing_to_bot)
            ||
            (is_bot && !is_routing_to_bot)
        )
    ) {
        window.location.href = route_to.pathname;
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

const TraderInterceptor = (props) => (
    <React.Fragment>
        <Prompt when={ true } message={ interceptAcrossBot } />
        <Trader { ...props } />
    </React.Fragment>
);

const Bot = lazy(() => {
    const el_head = document.querySelector('head');
    const el_scratch_js = document.createElement('script');
    el_scratch_js.src = './js/bot/scratch.min.js';
    el_head.appendChild(el_scratch_js);
    // eslint-disable-next-line import/no-unresolved
    return import(/* webpackChunkName: "bot" */ 'deriv-bot');
});

const BotInterceptor = (props) => (
    <React.Fragment>
        <Prompt when={ true } message={ interceptAcrossBot } />
        <Bot { ...props } />
    </React.Fragment>
);

// TODO: search tag: test-route-parent-info -> Enable test for getting route parent info when there are nested routes
const initRoutesConfig = () => ([
    { path: routes.index,     component: RouterRedirect,            title: '',                                     to: routes.root },
    { path: routes.bot,       component: BotInterceptor,            title: localize('Bot') },
    { path: routes.root,      component: TraderInterceptor,         title: localize('Trader'),              exact: true },
    { path: routes.mt5,       component: TraderInterceptor,         title: localize('MT5'),                 is_authenticated: true },
    { path: routes.reports,   component: TraderInterceptor,         title: localize('Reports'),             is_authenticated: true },
    { path: routes.account,   component: TraderInterceptor,         title: localize('Accounts management'), is_authenticated: true },
    { path: routes.contract,  component: TraderInterceptor,         title: localize('Contract Details'),    is_authenticated: true },
    { path: routes.error404,  component: TraderInterceptor,         title: localize('Error 404') },
    { path: routes.redirect,  component: Redirect,                  title: localize('Redirect') },
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
