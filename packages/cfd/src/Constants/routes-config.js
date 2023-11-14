import React from 'react';
import { routes } from '@deriv/shared';
import { localize } from '@deriv/translations';
import CFDCompareAccounts from 'Containers/cfd-compare-accounts';
// Error Routes
const Page404 = React.lazy(() => import(/* webpackChunkName: "404" */ '../Modules/Page404'));

// Order matters
const initRoutesConfig = () => {
    return [
        {
            path: routes.compare_cfds,
            component: props => <CFDCompareAccounts {...props} />,
            getTitle: () => localize('Compare CFD accounts'),
            is_authenticated: false,
        },
    ];
};

let routesConfig;

// For default page route if page/path is not found, must be kept at the end of routes_config array
const route_default = { path: routes.error404, component: Page404, getTitle: () => localize('Error 404') };

const getRoutesConfig = () => {
    if (!routesConfig) {
        routesConfig = initRoutesConfig();
        routesConfig.push(route_default);
    }
    return routesConfig;
};

export default getRoutesConfig;
