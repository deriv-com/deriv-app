import React from 'react';
import CFD from '../Containers';
import { routes } from '@deriv/shared';
import { localize } from '@deriv/translations';
import CFDCompareAccounts from 'Containers/cfd-compare-accounts';
// Error Routes
const Page404 = React.lazy(() => import(/* webpackChunkName: "404" */ '../Modules/Page404'));

// Order matters
const initRoutesConfig = () => {
    return [
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
        // This is placed here to avoid conflict with other routes
        // TODO: [refactoring] - Remove this route once we do refactoring
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
