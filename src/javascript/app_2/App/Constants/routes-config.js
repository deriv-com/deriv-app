import { lazy }        from 'react';
import { Redirect }    from 'react-router-dom';
import { localize }    from '_common/localize';
import { routes }      from 'Constants';

import {
    IconPortfolio,
    IconStatement }    from 'Assets/Header/NavBar';
// import Statement       from 'Modules/Statement';
import Trade           from 'Modules/Trading';

const ContractDetails = lazy(() => import(/* webpackChunkName: "contract" */  'Modules/Contract'));
const Portfolio       = lazy(() => import(/* webpackChunkName: "portfolio" */ 'Modules/Portfolio'));
const Settings        = lazy(() => import(/* webpackChunkName: "settings" */  'Modules/settings/settings.jsx'));
const Statement       = lazy(() => import(/* webpackChunkName: "statement" */ 'Modules/Statement'));

// Settings Routes
const AccountPassword        = lazy(() => import(/* webpackChunkName: "account_password" */       'Modules/settings/sections/account-password.jsx'));
const ApiToken               = lazy(() => import(/* webpackChunkName: "api_token" */               'Modules/settings/sections/api-token.jsx'));
const AuthorizedApplications = lazy(() => import(/* webpackChunkName: "authorized_application" */ 'Modules/settings/sections/authorized-applications.jsx'));
const CashierPassword        = lazy(() => import(/* webpackChunkName: "cashier_password" */       'Modules/settings/sections/cashier-password.jsx'));
const FinancialAssessment    = lazy(() => import(/* webpackChunkName: "financial_assessment" */   'Modules/settings/sections/financial-assessment.jsx'));
const Limits                 = lazy(() => import(/* webpackChunkName: "limits" */                 'Modules/settings/sections/limits.jsx'));
const LoginHistory           = lazy(() => import(/* webpackChunkName: "login_history" */          'Modules/settings/sections/login-history.jsx'));
const PersonalDetails        = lazy(() => import(/* webpackChunkName: "personal_details" */       'Modules/settings/sections/personal-details.jsx'));
const SelfExclusion          = lazy(() => import(/* webpackChunkName: "self_exclusion" */         'Modules/settings/sections/self-exclusion.jsx'));

// Error Routes
const Page404 = lazy(() => import(/* webpackChunkName: "404" */ 'Modules/Page404'));

const initRoutesConfig = () => ([
    { path: routes.contract,  component: ContractDetails, title: localize('Contract Details'),  is_authenticated: true },
    { path: routes.index,     component: Redirect,        title: '',                            to: '/trade' },
    { path: routes.portfolio, component: Portfolio,       title: localize('Portfolio'),         is_authenticated: true, icon_component: IconPortfolio },
    { path: routes.root,      component: Redirect,        title: '',                            exact: true, to: '/trade' },
    { path: routes.statement, component: Statement,       title: localize('Statement'),         is_authenticated: true, icon_component: IconStatement },
    { path: routes.trade,     component: Trade,           title: localize('Trade'),             exact: true },
    {
        path            : routes.settings,
        component       : Settings,
        is_authenticated: true,
        routes          : [
            { path: routes.personal,         component: PersonalDetails,        title: localize('Personal Details') },
            { path: routes.financial,        component: FinancialAssessment,    title: localize('Financial Assessment') },
            { path: routes.account_password, component: AccountPassword,        title: localize('Account Password') },
            { path: routes.cashier_password, component: CashierPassword,        title: localize('Cashier Password') },
            { path: routes.exclusion,        component: SelfExclusion,          title: localize('Self Exclusion') },
            { path: routes.limits,           component: Limits,                 title: localize('Account Limits') },
            { path: routes.history,          component: LoginHistory,           title: localize('Login History') },
            { path: routes.token,            component: ApiToken,               title: localize('API Token') },
            { path: routes.apps,             component: AuthorizedApplications, title: localize('Authorized Applications') },
        ],
    },
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
