import { lazy }        from 'react';
import { Redirect }    from 'react-router-dom';
import { localize }    from 'App/i18n';
import { routes }      from 'Constants';

// import Statement       from 'Modules/Statement';
import Trade             from 'Modules/Trading';

const ContractDetails = lazy(() => import(/* webpackChunkName: "contract" */  'Modules/Contract'));

// Reports Routes
const Reports       = lazy(() => import(/* webpackChunkName: "reports" */        'Modules/Reports'));
const OpenPositions = lazy(() => import(/* webpackChunkName: "open_positions" */ 'Modules/Reports/Containers/open-positions.jsx'));
const ProfitTable   = lazy(() => import(/* webpackChunkName: "profit_table" */   'Modules/Reports/Containers/profit-table.jsx'));
const Statement     = lazy(() => import(/* webpackChunkName: "statement" */      'Modules/Reports/Containers/statement.jsx'));

// Error Routes
const Page404 = lazy(() => import(/* webpackChunkName: "404" */ 'Modules/Page404'));

const initRoutesConfig = () => ([
    { path: routes.contract,  component: ContractDetails, title: localize('Contract Details'),  is_authenticated: true },
    { path: routes.index,     component: Redirect,        title: '',                            to: routes.trade },
    {
        path            : routes.reports,
        component       : Reports,
        is_authenticated: true,
        title           : localize('Reports'),
        routes          : [
            { path: routes.positions, component: OpenPositions, title: localize('Open Positions'), icon_component: 'IconOpenPositions', default: true },
            { path: routes.profit,    component: ProfitTable,   title: localize('Profit Table'),   icon_component: 'IconProfitTable' },
            { path: routes.statement, component: Statement,     title: localize('Statement'),      icon_component: 'IconStatement' },
        ],
    },
    { path: routes.trade,     component: Trade,           title: localize('Trade'),             exact: true },
    { path: routes.error404, component: Page404, title: localize('Error 404') },
]);

let routesConfig;

// For default page route if page/path is not found, must be kept at the end of routes_config array
const route_default  = { component: Page404, title: localize('Error 404') };

const getRoutesConfig = () => {
    if (!routesConfig) {
        routesConfig = initRoutesConfig();
    }
    routesConfig.push(route_default);
    return routesConfig;
};

export default getRoutesConfig;
