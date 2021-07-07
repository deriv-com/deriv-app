import React from 'react';
import { routes, makeLazyLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';
import { localize } from '@deriv/translations';
import Trade from 'Modules/Trading';

const ContractDetails = React.lazy(() => import(/* webpackChunkName: "contract" */ 'Modules/Contract'));

// CFD Routes
const CFD = React.lazy(() => import(/* webpackChunkName: "cfd", webpackPrefetch: true */ 'Modules/CFD'));

// Error Routes
const Page404 = React.lazy(() => import(/* webpackChunkName: "404" */ 'Modules/Page404'));

const lazyLoadReportComponent = makeLazyLoader(
    () => import(/* webpackChunkName: "reports" */ 'Modules/Reports'),
    () => <Loading />
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
        {
            path: routes.dxtrade,
            // eslint-disable-next-line react/display-name
            component: props => <CFD {...props} platform='dxtrade' />,
            getTitle: () => localize('Deriv X'),
            is_authenticated: false,
        },
        {
            path: routes.mt5,
            // eslint-disable-next-line react/display-name
            component: props => <CFD {...props} platform='mt5' />,
            getTitle: () => localize('MT5'),
            is_authenticated: false,
        },
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
                    getTitle: () => localize('Profit table'),
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
        { path: routes.trade, component: Trade, getTitle: () => localize('Trader'), exact: true },
    ];
};

let routesConfig;

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
