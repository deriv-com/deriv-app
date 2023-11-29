import React from 'react';
import { RouteComponentProps } from 'react-router';
import { routes, moduleLoader } from '@deriv/shared';
import { localize } from '@deriv/translations';
import Trade from 'Modules/Trading';
import { TRouteConfig } from 'Types';

const ContractDetails = React.lazy(
    () =>
        moduleLoader(() => import(/* webpackChunkName: "contract" */ 'Modules/Contract')) as Promise<{
            default: React.ComponentType<RouteComponentProps>;
        }>
);

// Error Routes
const Page404 = React.lazy(
    () =>
        moduleLoader(() => import(/* webpackChunkName: "404" */ 'Modules/Page404')) as Promise<{
            default: React.ComponentType<Record<string, never>>;
        }>
);

// Order matters
const initRoutesConfig = () => {
    return [
        {
            path: routes.contract,
            component: ContractDetails,
            // Don't use `Localize` component since native html tag like `option` cannot render them
            getTitle: () => localize('Contract Details'),
            is_authenticated: true,
        },
        { path: routes.trade, component: Trade, getTitle: () => localize('Trader'), exact: true },
    ];
};

let routesConfig: TRouteConfig[] | undefined;

// For default page route if page/path is not found, must be kept at the end of routes_config array
const route_default = { component: Page404, getTitle: () => localize('Error 404') };

const getRoutesConfig = () => {
    if (!routesConfig) {
        routesConfig = initRoutesConfig();
        routesConfig.push(route_default);
    }
    return routesConfig;
};

export default getRoutesConfig;
