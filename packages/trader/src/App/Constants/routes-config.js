import React, { lazy } from 'react';
import loadable from 'react-loadable';
import { localize } from '@deriv/translations';
import { routes } from 'Constants';
import Trade from 'Modules/Trading';

const ContractDetails = lazy(() => import(/* webpackChunkName: "contract" */ 'Modules/Contract'));

// MT5 Routes
const MT5 = lazy(() => import(/* webpackChunkName: "mt5", webpackPrefetch: true */ 'Modules/MT5'));

// Error Routes
const Page404 = lazy(() => import(/* webpackChunkName: "404" */ 'Modules/Page404'));

const makeLazyLoader = importFn => component_name =>
    loadable.Map({
        loader: {
            ComponentModule: importFn,
        },
        render(loaded, props) {
            const ComponentLazy = loaded.ComponentModule.default[component_name];
            return <ComponentLazy {...props} />;
        },
        loading: () => null,
    });

const lazyLoadReportComponent = makeLazyLoader(() => import(/* webpackChunkName: "reports" */ 'Modules/Reports'));
const lazyLoadAccountComponent = makeLazyLoader(() => import(/* webpackChunkName: "account" */ 'Modules/Account'));

// Order matters
const initRoutesConfig = () => [
    { path: routes.contract, component: ContractDetails, title: localize('Contract Details'), is_authenticated: true },
    { path: routes.mt5, component: MT5, title: localize('MT5'), is_authenticated: true },
    {
        path: routes.reports,
        component: lazyLoadReportComponent('Reports'),
        is_authenticated: true,
        title: localize('Reports'),
        routes: [
            {
                path: routes.positions,
                component: lazyLoadReportComponent('OpenPositions'),
                title: localize('Open Positions'),
                icon_component: 'IcOpenPositions',
                default: true,
            },
            {
                path: routes.profit,
                component: lazyLoadReportComponent('ProfitTable'),
                title: localize('Profit Table'),
                icon_component: 'IcProfitTable',
            },
            {
                path: routes.statement,
                component: lazyLoadReportComponent('Statement'),
                title: localize('Statement'),
                icon_component: 'IcStatement',
            },
        ],
    },
    {
        path: routes.account,
        component: lazyLoadAccountComponent('Account'),
        is_authenticated: true,
        title: localize('Accounts management'),
        routes: [
            {
                title: localize('Profile'),
                icon: 'IcUserOutline',
                subroutes: [
                    {
                        path: routes.personal_details,
                        component: lazyLoadAccountComponent('PersonalDetails'),
                        title: localize('Personal details'),
                        default: true,
                    },
                    {
                        path: routes.financial_assessment,
                        component: lazyLoadAccountComponent('FinancialAssessment'),
                        title: localize('Financial assessment'),
                    },
                ],
            },
            {
                title: localize('Verification'),
                icon: 'IcVerification',
                subroutes: [
                    {
                        path: routes.proof_of_identity,
                        component: lazyLoadAccountComponent('ProofOfIdentity'),
                        title: localize('Proof of identity'),
                    },
                    {
                        path: routes.proof_of_address,
                        component: lazyLoadAccountComponent('ProofOfAddress'),
                        title: localize('Proof of address'),
                    },
                ],
            },
            {
                title: localize('Security and safety'),
                icon: 'IcSecurity',
                subroutes: [
                    {
                        path: routes.deriv_password,
                        component: lazyLoadAccountComponent('DerivPassword'),
                        title: localize('Deriv password'),
                    },
                    {
                        path: routes.account_limits,
                        component: lazyLoadAccountComponent('AccountLimits'),
                        title: localize('Account limits'),
                    },
                ],
            },
        ],
    },
    { path: routes.trade, component: Trade, title: localize('Trade'), exact: true },
];

let routesConfig;

// For default page route if page/path is not found, must be kept at the end of routes_config array
const route_default = { component: Page404, title: localize('Error 404') };

const getRoutesConfig = () => {
    if (!routesConfig) {
        routesConfig = initRoutesConfig();
        routesConfig.push(route_default);
    }
    return routesConfig;
};

export default getRoutesConfig;
