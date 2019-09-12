import { lazy }                       from 'react';
import { Redirect as RouterRedirect } from 'react-router-dom';
import { Redirect }                   from 'App/Containers/Redirect';
import { localize }                   from 'App/i18n';
import { routes }                     from 'Constants';

import Trade from 'Modules/Trading';

const ContractDetails = lazy(() => import(/* webpackChunkName: "contract" */  'Modules/Contract'));

// Reports Routes
const Reports       = lazy(() => import(/* webpackChunkName: "reports" */        'Modules/Reports'));
const OpenPositions = lazy(() => import(/* webpackChunkName: "open_positions" */ 'Modules/Reports/Containers/open-positions.jsx'));
const ProfitTable   = lazy(() => import(/* webpackChunkName: "profit_table" */   'Modules/Reports/Containers/profit-table.jsx'));
const Statement     = lazy(() => import(/* webpackChunkName: "statement" */      'Modules/Reports/Containers/statement.jsx'));

// Account Management Routes
const Account             = lazy(() => import(/* webpackChunkName: "account" */              'Modules/Account'));
const PersonalDetails     = lazy(() => import(/* webpackChunkName: "personal_details" */     'Modules/Account/Sections/Profile/PersonalDetails'));
const FinancialAssessment = lazy(() => import(/* webpackChunkName: "financial_assessment" */ 'Modules/Account/Sections/Profile/FinancialAssessment'));
const ProofOfIdentity     = lazy(() => import(/* webpackChunkName: "proof_of_identity" */    'Modules/Account/Sections/Verification/ProofOfIdentity'));
const ProofOfAddress      = lazy(() => import(/* webpackChunkName: "proof_of_address" */     'Modules/Account/Sections/Verification/ProofOfAddress'));
const DerivPassword       = lazy(() => import(/* webpackChunkName: "deriv_password" */       'Modules/Account/Sections/Security/DerivPassword'));
const AccountLimits       = lazy(() => import(/* webpackChunkName: "account_limits" */       'Modules/Account/Sections/Security/AccountLimits'));

// Error Routes
const Page404 = lazy(() => import(/* webpackChunkName: "404" */ 'Modules/Page404'));

const initRoutesConfig = () => ([
    { path: routes.contract,  component: ContractDetails, title: localize('Contract Details'),  is_authenticated: true },
    { path: routes.index,     component: RouterRedirect,  title: '',                            to: routes.trade },
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
    {
        path            : routes.account,
        component       : Account,
        is_authenticated: true,
        title           : localize('Accounts management'),
        routes          : [
            {
                title    : localize('Profile'),
                icon     : 'IconUser',
                subroutes: [
                    { path: routes.personal_details,     component: PersonalDetails,     title: localize('Personal details'), default: true },
                    { path: routes.financial_assessment, component: FinancialAssessment, title: localize('Financial assessment') },
                ],
            },
            {
                title    : localize('Verification'),
                icon     : 'IconVerification',
                subroutes: [
                    { path: routes.proof_of_identity, component: ProofOfIdentity, title: localize('Proof of identity') },
                    { path: routes.proof_of_address,  component: ProofOfAddress,  title: localize('Proof of address') },
                ],
            },
            {
                title    : localize('Security and safety'),
                icon     : 'IconSecurity',
                subroutes: [
                    { path: routes.deriv_password, component: DerivPassword, title: localize('Deriv password') },
                    { path: routes.account_limits, component: AccountLimits, title: localize('Account limits') },
                ],
            },
        ],
    },
    { path: routes.trade,     component: Trade,           title: localize('Trade'),    exact: true },
    { path: routes.error404,  component: Page404,         title: localize('Error 404') },
    { path: routes.redirect,  component: Redirect,        title: localize('Redirect') },
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
