import React from 'react';
import { routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
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
        title: <Localize i18n_default_text='Account deactivated' />,
    },
    {
        path: routes.account,
        component: Account,
        is_authenticated: true,
        title: <Localize i18n_default_text='Account Settings' />,
        icon_component: 'IcUserOutline',
        routes: [
            {
                title: <Localize i18n_default_text='Profile' />,
                icon: 'IcUserOutline',
                subroutes: [
                    {
                        path: routes.personal_details,
                        component: PersonalDetails,
                        title: <Localize i18n_default_text='Personal details' />,
                        default: true,
                    },
                    ...(is_deriv_crypto
                        ? []
                        : [
                              {
                                  path: routes.financial_assessment,
                                  component: FinancialAssessment,
                                  title: <Localize i18n_default_text='Financial assessment' />,
                              },
                          ]),
                ],
            },
            ...(is_deriv_crypto
                ? []
                : [
                      {
                          title: <Localize i18n_default_text='Verification' />,
                          icon: 'IcVerification',
                          subroutes: [
                              {
                                  path: routes.proof_of_identity,
                                  component: ProofOfIdentity,
                                  title: <Localize i18n_default_text='Proof of identity' />,
                              },
                              {
                                  path: routes.proof_of_address,
                                  component: ProofOfAddress,
                                  title: <Localize i18n_default_text='Proof of address' />,
                              },
                          ],
                      },
                  ]),
            {
                title: <Localize i18n_default_text='Security and safety' />,
                icon: 'IcSecurity',
                subroutes: [
                    {
                        path: routes.deriv_password,
                        component: DerivPassword,
                        title: <Localize i18n_default_text='Deriv password' />,
                    },
                    {
                        path: routes.self_exclusion,
                        component: SelfExclusion,
                        title: <Localize i18n_default_text='Self exclusion' />,
                    },
                    {
                        path: routes.account_limits,
                        component: AccountLimits,
                        title: <Localize i18n_default_text='Account limits' />,
                    },
                    {
                        path: routes.login_history,
                        component: LoginHistory,
                        title: <Localize i18n_default_text='Login history' />,
                    },
                    {
                        path: routes.api_token,
                        component: ApiToken,
                        title: <Localize i18n_default_text='API token' />,
                    },
                    {
                        path: routes.connected_apps,
                        component: ConnectedApps,
                        title: <Localize i18n_default_text='Connected apps' />,
                    },
                    {
                        path: routes.two_factor_authentication,
                        component: TwoFactorAuthentication,
                        title: <Localize i18n_default_text='Two-factor authentication' />,
                    },
                    {
                        path: routes.deactivate_account,
                        component: DeactivateAccount,
                        title: <Localize i18n_default_text='Deactivate account' />,
                    },
                ],
            },
        ],
    },
];

let routesConfig;

// For default page route if page/path is not found, must be kept at the end of routes_config array
const route_default = { component: Page404, title: <Localize i18n_default_text='Error 404' /> };

const getRoutesConfig = ({ is_deriv_crypto }) => {
    if (!routesConfig) {
        routesConfig = initRoutesConfig({ is_deriv_crypto });
        routesConfig.push(route_default);
    }
    return routesConfig;
};

export default getRoutesConfig;
