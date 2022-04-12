import React from 'react';
import { routes } from '@deriv/shared';
import { localize } from '@deriv/translations';
// import { OpenPositions, ProfitTable, Statement, Reports } from '../Containers/index';
import OpenPositions from '../Containers/open-positions.jsx';
import ProfitTable from '../Containers/profit-table.jsx';
import Statement from '../Containers/statement.jsx';
import Reports from '../Containers/reports.jsx';

// Error Routes
const Page404 = React.lazy(() => import(/* webpackChunkName: "404" */ '../Modules/Page404'));

// Order matters
const initRoutesConfig = () => {
    return [
        {
            path: routes.reports,
            component: <Reports />,
            is_authenticated: true,
            getTitle: () => localize('Reports'),
            icon_component: 'IcReports',
            routes: [
                {
                    path: routes.positions,
                    component: <OpenPositions />,
                    getTitle: () => localize('Open positions'),
                    icon_component: 'IcOpenPositions',
                    default: true,
                },
                {
                    path: routes.profit,
                    component: <ProfitTable />,
                    getTitle: () => localize('Profit table'),
                    icon_component: 'IcProfitTable',
                },
                {
                    path: routes.statement,
                    component: <Statement />,
                    getTitle: () => localize('Statement'),
                    icon_component: 'IcStatement',
                },
            ],
        },
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
