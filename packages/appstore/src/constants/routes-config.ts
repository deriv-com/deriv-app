import { localize } from '@deriv/translations';
import TradingHub from 'Modules/trading-hub';
import { TRoute } from 'Types';
import { routes, moduleLoader } from '@deriv/shared';
import AppStore from 'Modules/appstore';
import React from 'react';

const Page404 = React.lazy(() => moduleLoader(() => import(/* webpackChunkName: "404" */ 'Modules/Page404')));

// 1. Order matters! Put more specific consumer_routes at the top.
// 2. Don't use `Localize` component since native html tag like `option` cannot render them
const initRoutesConfig = (): TRoute[] => [
    {
        path: routes.appstore,
        component: AppStore,
        is_authenticated: false,
        getTitle: () => localize('App Store'),
        routes: [
            {
                path: routes.trading_hub,
                component: TradingHub,
                getTitle: () => localize('Trading Hub'),
            },
        ],
    },
];

let routes_config: Array<TRoute>;

const route_default = { component: Page404, getTitle: () => localize('Error 404') };

const getRoutesConfig = (): TRoute[] => {
    // For default page route if page/path is not found, must be kept at the end of routes_config array.
    if (!routes_config) {
        routes_config = initRoutesConfig();
        routes_config.push(route_default);
    }

    return routes_config;
};
export default getRoutesConfig;
