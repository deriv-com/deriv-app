import React from 'react';
import { routes, moduleLoader } from '@deriv/shared';
import { localize } from '@deriv/translations';
import {
    AccountLimits,
    Passwords,
    PersonalDetails,
    TradingAssessment,
    FinancialAssessment,
    ProofOfIdentity,
    ProofOfAddress,
    ApiToken,
    TwoFactorAuthentication,
    SelfExclusion,
    Account,
    ClosingAccount,
    ConnectedApps,
    LoginHistory,
    AccountClosed,
    DeactivateAccount,
} from 'Sections';

// Error Routes
const Page404 = React.lazy(() => moduleLoader(() => import(/* webpackChunkName: "404" */ 'Modules/Page404')));

// Order matters
const initRoutesConfig = ({ is_appstore }) => [
    {
        path: routes.account_closed,
        component: AccountClosed,
        is_authenticated: false,
        // Don't use `Localize` component since native html tag like `option` cannot render them
        getTitle: () => localize('Account closed'),
    },
    {
        // TODO: Remove once mobile team has changed this link
        path: routes.deactivate_account,
        component: DeactivateAccount,
    },
    {
        path: routes.account,
        component: Account,
        is_authenticated: true,
        getTitle: () => localize('Account Settings'),
        icon_component: 'IcUserOutline',
        routes: [
            {
                getTitle: () => localize('Profile'),
                icon: 'IcUserOutline',
                subroutes: [
                    {
                        path: routes.personal_details,
                        component: PersonalDetails,
                        getTitle: () => localize('Personal details'),
                        default: true,
                    },
                ],
            },
            {
                getTitle: () => localize('Assessments'),
                icon: 'IcAssessment',
                subroutes: [
                    {
                        path: routes.trading_assessment,
                        component: TradingAssessment,
                        getTitle: () => localize('Trading assessment'),
                    },
                    {
                        path: routes.financial_assessment,
                        component: FinancialAssessment,
                        getTitle: () => localize('Financial assessment'),
                    },
                ],
            },
            {
                getTitle: () => localize('Verification'),
                icon: 'IcVerification',
                subroutes: [
                    {
                        path: routes.proof_of_identity,
                        component: ProofOfIdentity,
                        getTitle: () => localize('Proof of identity'),
                    },
                    {
                        path: routes.proof_of_address,
                        component: ProofOfAddress,
                        getTitle: () => localize('Proof of address'),
                    },
                ],
            },
            {
                getTitle: () => localize('Security and safety'),
                icon: 'IcSecurity',
                subroutes: [
                    {
                        path: routes.passwords,
                        component: Passwords,
                        getTitle: () => localize('Email and passwords'),
                    },
                    {
                        path: routes.self_exclusion,
                        component: SelfExclusion,
                        getTitle: () => (is_appstore ? localize('Self-exclusion') : localize('Self exclusion')),
                    },
                    {
                        path: routes.account_limits,
                        component: AccountLimits,
                        getTitle: () => (is_appstore ? localize('Withdrawal limits') : localize('Account limits')),
                    },
                    {
                        path: routes.login_history,
                        component: LoginHistory,
                        getTitle: () => localize('Login history'),
                    },
                    ...(is_appstore
                        ? []
                        : [
                              {
                                  path: routes.api_token,
                                  component: ApiToken,
                                  getTitle: () => localize('API token'),
                              },
                          ]),
                    {
                        path: routes.connected_apps,
                        component: ConnectedApps,
                        getTitle: () => localize('Connected apps'),
                    },
                    {
                        path: routes.two_factor_authentication,
                        component: TwoFactorAuthentication,
                        getTitle: () => localize('Two-factor authentication'),
                    },
                    {
                        path: routes.closing_account,
                        component: ClosingAccount,
                        getTitle: () => localize('Close your account'),
                    },
                ],
            },
            // TO DO -- Please remove these comments after changing for dashboard routes
            // It is possible to add a Deriv Dashboard only path.
            // ...(is_appstore
            //     ? [
            //           {
            //               component: Home,
            //               getTitle: () => localize('Dashboard-only path'),
            //               is_authenticated: false,
            //               path: routes.resources,
            //           },
            //       ]
            //     : []),
        ],
    },
];

let routesConfig;

// For default page route if page/path is not found, must be kept at the end of routes_config array
const route_default = { component: Page404, getTitle: () => localize('Error 404') };

const getRoutesConfig = ({ is_appstore }) => {
    if (!routesConfig) {
        routesConfig = initRoutesConfig({ is_appstore });
        routesConfig.push(route_default);
    }
    return routesConfig;
};

export default getRoutesConfig;
