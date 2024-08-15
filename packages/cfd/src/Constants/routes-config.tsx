import React from 'react';
import { routes } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { Loading } from '@deriv/components';
import { TRoute, TRouteConfig } from '../types/types';

const CFDCompareAccounts = React.lazy(
    () => import(/* webpackChunkName: "cfd-compare-accounts" */ 'Containers/cfd-compare-accounts')
);

// Error Routes
const Page404 = React.lazy(() => import(/* webpackChunkName: "404" */ '../Modules/Page404'));

// Order matters
const initRoutesConfig = () => [
    {
        path: routes.compare_cfds,
        component: () => (
            <React.Suspense fallback={<Loading />}>
                <CFDCompareAccounts />
            </React.Suspense>
        ),
        getTitle: () => localize('Compare CFD accounts'),
        is_authenticated: false,
    },
];

let routesConfig: TRouteConfig[] | undefined;

// For default page route if page/path is not found, must be kept at the end of routes_config array
const route_default: TRoute = { path: routes.error404, component: Page404, getTitle: () => localize('Error 404') };

const getRoutesConfig = (): TRouteConfig[] => {
    if (!routesConfig) {
        routesConfig = initRoutesConfig() as TRouteConfig[];
        routesConfig.push(route_default);
    }
    return routesConfig;
};

export type TPage404 = typeof Page404;

export default getRoutesConfig;
