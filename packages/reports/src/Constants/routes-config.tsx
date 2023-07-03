import React from 'react';
import { routes, makeLazyLoader, moduleLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';
import { localize } from '@deriv/translations';
import type { TRoute, TRouteConfig } from 'Types';

const Page404 = React.lazy(() => import(/* webpackChunkName: "404" */ 'Modules/Page404'));

const lazyLoadReportComponent = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "reports-routes" */ '../Containers')),
    () => <Loading />
);

// Order matters
const initRoutesConfig = (): TRouteConfig[] => {
    return [
        {
            path: routes.reports,
            component: lazyLoadReportComponent('Reports'),
            is_authenticated: true,
            getTitle: () => localize('Reports'),
            icon_component: 'IcReports',
            routes: [
                {
                    path: routes.positions,
                    component: lazyLoadReportComponent('OpenPositions'),
                    getTitle: () => localize('Open positions'),
                    icon_component: 'IcOpenPositions',
                    default: true,
                },
                {
                    path: routes.profit,
                    component: lazyLoadReportComponent('ProfitTable'),
                    getTitle: () => localize('Trade table'),
                    icon_component: 'IcProfitTable',
                },
                {
                    path: routes.statement,
                    component: lazyLoadReportComponent('Statement'),
                    getTitle: () => localize('Statement'),
                    icon_component: 'IcStatement',
                },
            ],
        },
    ];
};

let routesConfig: TRouteConfig[];

// For default page route if page/path is not found, must be kept at the end of routes_config array
const route_default: TRoute = { component: Page404, getTitle: () => localize('Error 404') };

const getRoutesConfig = (): TRouteConfig[] => {
    if (!routesConfig) {
        routesConfig = initRoutesConfig();
        routesConfig.push(route_default);
    }
    return routesConfig;
};

export default getRoutesConfig;
