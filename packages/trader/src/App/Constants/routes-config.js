import { lazy }                       from 'react';
import { localize }                   from 'deriv-translations';
import { routes }                     from 'Constants';

import PersonalDetails     from 'Modules/Account/Sections/Profile/PersonalDetails';
import FinancialAssessment from 'Modules/Account/Sections/Profile/FinancialAssessment';
import ProofOfIdentity     from 'Modules/Account/Sections/Verification/ProofOfIdentity';
import ProofOfAddress      from 'Modules/Account/Sections/Verification/ProofOfAddress';
import DerivPassword       from 'Modules/Account/Sections/Security/DerivPassword';
import AccountLimits       from 'Modules/Account/Sections/Security/AccountLimits';
import OpenPositions       from 'Modules/Reports/Containers/open-positions.jsx';
import ProfitTable         from 'Modules/Reports/Containers/profit-table.jsx';
import Statement           from 'Modules/Reports/Containers/statement.jsx';

import Trade from 'Modules/Trading';

const ContractDetails = lazy(() => import(/* webpackChunkName: "contract" */ 'Modules/Contract'));

// MT5 Routes
const MT5 = lazy(() => import(/* webpackChunkName: "mt5", webpackPrefetch: true */ 'Modules/MT5'));

// Reports Routes
const Reports = lazy(() => import(/* webpackChunkName: "reports" */ 'Modules/Reports'));

// Account Management Routes
const Account = lazy(() => import(/* webpackChunkName: "account" */ 'Modules/Account'));

// Error Routes
const Page404 = lazy(() => import(/* webpackChunkName: "404" */ 'Modules/Page404'));

const initRoutesConfig = () => ([
    { path: routes.contract,  component: ContractDetails, title: localize('Contract Details'),  is_authenticated: true },
    { path: routes.mt5,       component: MT5,             title: localize('MT5'),               is_authenticated: true },
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
