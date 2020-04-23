import { lazy } from 'react';
import { addRoutesConfig } from '@deriv/shared/utils/route';
import { localize } from '@deriv/translations';
import { routes } from 'Constants';
import Trade from 'Modules/Trading';
import Account, {
    PersonalDetails,
    FinancialAssessment,
    ProofOfAddress,
    ProofOfIdentity,
    DerivPassword,
    AccountLimits,
} from 'Modules/Account';
import Reports, { OpenPositions, ProfitTable, Statement } from 'Modules/Reports';

const ContractDetails = lazy(() => import(/* webpackChunkName: "contract" */ 'Modules/Contract'));

// MT5 Routes
const MT5 = lazy(() => import(/* webpackChunkName: "mt5", webpackPrefetch: true */ 'Modules/MT5'));

// Error Routes
const Page404 = lazy(() => import(/* webpackChunkName: "404" */ 'Modules/Page404'));

// Order matters
const initRoutesConfig = () => [
    { path: routes.contract, component: ContractDetails, title: localize('Contract Details'), is_authenticated: true },
    { path: routes.mt5, component: MT5, title: localize('MT5'), is_authenticated: true },
    {
        path: routes.reports,
        component: Reports,
        is_authenticated: true,
        title: localize('Reports'),
        icon_component: 'IcReports',
        routes: [
            {
                path: routes.positions,
                component: OpenPositions,
                title: localize('Open Positions'),
                icon_component: 'IcOpenPositions',
                default: true,
            },
            {
                path: routes.profit,
                component: ProfitTable,
                title: localize('Profit Table'),
                icon_component: 'IcProfitTable',
            },
            {
                path: routes.statement,
                component: Statement,
                title: localize('Statement'),
                icon_component: 'IcStatement',
            },
        ],
    },
    {
        path: routes.account,
        component: Account,
        is_authenticated: true,
        title: localize('Account Settings'),
        icon_component: 'IcUserOutline',
        routes: [
            {
                title: localize('Profile'),
                icon: 'IcUserOutline',
                subroutes: [
                    {
                        path: routes.personal_details,
                        component: PersonalDetails,
                        title: localize('Personal details'),
                        default: true,
                    },
                    {
                        path: routes.financial_assessment,
                        component: FinancialAssessment,
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
                        component: ProofOfIdentity,
                        title: localize('Proof of identity'),
                    },
                    { path: routes.proof_of_address, component: ProofOfAddress, title: localize('Proof of address') },
                ],
            },
            {
                title: localize('Security and safety'),
                icon: 'IcSecurity',
                subroutes: [
                    { path: routes.deriv_password, component: DerivPassword, title: localize('Deriv password') },
                    { path: routes.account_limits, component: AccountLimits, title: localize('Account limits') },
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
        addRoutesConfig(routesConfig);
    }
    return routesConfig;
};

export default getRoutesConfig;
