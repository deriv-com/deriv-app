import React from 'react';
import { routes } from '@deriv/shared';
import { localize } from '@deriv/translations';
import {
    AccountLimits,
    DerivPassword,
    PersonalDetails,
    FinancialAssessment,
    ProofOfIdentity,
    ProofOfAddress,
    ApiToken,
    TwoFactorAuthentication,
    SelfExclusion,
    Account,
    DeactivateAccount,
    ConnectedApps,
    LoginHistory,
    AccountDeactivated,
} from 'Sections';

// Error Routes
const Page404 = React.lazy(() => import(/* webpackChunkName: "404" */ 'Modules/Page404'));

// Order matters
const initRoutesConfig = ({ is_deriv_crypto }) => [
    {
        path: routes.account_deactivated,
        component: AccountDeactivated,
        is_authenticated: false,
        // Don't use `Localize` component since native html tag like `option` cannot render them
        getTitle: () => localize('Account deactivated'),
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
                    ...(is_deriv_crypto
                        ? []
                        : [
                              {
                                  path: routes.financial_assessment,
                                  component: FinancialAssessment,
                                  getTitle: () => localize('Financial assessment'),
                              },
                          ]),
                ],
            },
            ...(is_deriv_crypto
                ? []
                : [
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
                  ]),
            {
                getTitle: () => localize('Security and safety'),
                icon: 'IcSecurity',
                subroutes: [
                    {
                        path: routes.deriv_password,
                        component: DerivPassword,
                        getTitle: () => localize('Deriv password'),
                    },
                    {
                        path: routes.self_exclusion,
                        component: SelfExclusion,
                        getTitle: () => localize('Self exclusion'),
                    },
                    {
                        path: routes.account_limits,
                        component: AccountLimits,
                        getTitle: () => localize('Account limits'),
                    },
                    {
                        path: routes.login_history,
                        component: LoginHistory,
                        getTitle: () => localize('Login history'),
                    },
                    {
                        path: routes.api_token,
                        component: ApiToken,
                        getTitle: () => localize('API token'),
                    },
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
                        path: routes.deactivate_account,
                        component: DeactivateAccount,
                        getTitle: () => localize('Deactivate account'),
                    },
                ],
            },
        ],
    },
];

let routesConfig;

// For default page route if page/path is not found, must be kept at the end of routes_config array
const route_default = { component: Page404, getTitle: () => localize('Error 404') };

const getRoutesConfig = ({ is_deriv_crypto }) => {
    if (!routesConfig) {
        routesConfig = initRoutesConfig({ is_deriv_crypto });
        routesConfig.push(route_default);
    }
    return routesConfig;
};

export default getRoutesConfig;
