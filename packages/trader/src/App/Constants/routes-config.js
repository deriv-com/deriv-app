import React from 'react';
import Loadable from 'react-loadable';
import { Loading } from '@deriv/components';
import { routes } from '@deriv/shared';

import { Localize } from '@deriv/translations';
import Trade from 'Modules/Trading';

const ContractDetails = React.lazy(() => import(/* webpackChunkName: "contract" */ 'Modules/Contract'));

// MT5 Routes
const MT5 = React.lazy(() => import(/* webpackChunkName: "mt5", webpackPrefetch: true */ 'Modules/MT5'));

// Error Routes
const Page404 = React.lazy(() => import(/* webpackChunkName: "404" */ 'Modules/Page404'));

const handleLoading = props => {
    // 200ms default
    if (props.pastDelay) {
        return <Loading />;
    }
    return null;
};

const makeLazyLoader = importFn => component_name =>
    Loadable.Map({
        loader: {
            ComponentModule: importFn,
        },
        render(loaded, props) {
            const ComponentLazy = loaded.ComponentModule.default[component_name];
            return <ComponentLazy {...props} />;
        },
        loading: handleLoading,
    });

const lazyLoadReportComponent = makeLazyLoader(() => import(/* webpackChunkName: "reports" */ 'Modules/Reports'));

// Order matters
const initRoutesConfig = () => [
    {
        path: routes.contract,
        component: ContractDetails,
        title: <Localize i18n_default_text='Contract Details' />,
        is_authenticated: true,
    },
    { path: routes.mt5, component: MT5, title: <Localize i18n_default_text='MT5' />, is_authenticated: false },
    {
        path: routes.reports,
        component: lazyLoadReportComponent('Reports'),
        is_authenticated: true,
        title: <Localize i18n_default_text='Reports' />,
        icon_component: 'IcReports',
        routes: [
            {
                path: routes.positions,
                component: lazyLoadReportComponent('OpenPositions'),
                title: <Localize i18n_default_text='Open positions' />,
                icon_component: 'IcOpenPositions',
                default: true,
            },
            {
                path: routes.profit,
                component: lazyLoadReportComponent('ProfitTable'),
                title: <Localize i18n_default_text='Profit table' />,
                icon_component: 'IcProfitTable',
            },
            {
                path: routes.statement,
                component: lazyLoadReportComponent('Statement'),
                title: <Localize i18n_default_text='Statement' />,
                icon_component: 'IcStatement',
            },
        ],
    },
    { path: routes.trade, component: Trade, title: <Localize i18n_default_text='Trader' />, exact: true },
];

let routesConfig;

// For default page route if page/path is not found, must be kept at the end of routes_config array
const route_default = { component: Page404, title: <Localize i18n_default_text='Error 404' /> };

const getRoutesConfig = () => {
    if (!routesConfig) {
        routesConfig = initRoutesConfig();
        routesConfig.push(route_default);
    }
    return routesConfig;
};

export default getRoutesConfig;
