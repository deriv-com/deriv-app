import { localize } from '@deriv/translations';
import TradingHub from 'Modules/trading-hub';
import { routes, moduleLoader } from '@deriv/shared';
import React from 'react';
import { TRouteConfig, TRoute } from 'Types';

const Page404 = React.lazy(() => moduleLoader(() => import(/* webpackChunkName: "404" */ 'Modules/Page404')));
export type TPage404 = typeof Page404;

// 1. Order matters! Put more specific consumer_routes at the top.
// 2. Don't use `Localize` component since native html tag like `option` cannot render them
const initRoutesConfig = () => [
    {
        path: routes.trading_hub,
        component: TradingHub,
        getTitle: () => localize('Trading Hub'),
    },
];

let routes_config: undefined | TRouteConfig[];

// For default page route if page/path is not found, must be kept at the end of routes_config array
const route_default: TRoute = { component: Page404, getTitle: () => localize('Error 404') };

const getRoutesConfig = (): TRouteConfig[] => {
    if (!routes_config) {
        routes_config = initRoutesConfig();
        routes_config.push(route_default);
    }

    return routes_config;
};
export default getRoutesConfig;
