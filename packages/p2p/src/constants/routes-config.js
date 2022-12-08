import React from 'react';
import { routes, moduleLoader } from '@deriv/shared';
import { localize } from 'Components/i18next';
import MyAds from 'Components/my-ads';
import BuySell from 'Components/buy-sell';
import AdvertiserPage from 'Components/advertiser-page';
import MyProfile from 'Components/my-profile';

// Error Routes
const Page404 = React.lazy(() => moduleLoader(() => import(/* webpackChunkName: "404" */ '../components/page404')));

// Order matters
const initRoutesConfig = () => [
    {
        path: routes.p2p_buy_sell,
        component: BuySell,
        is_authenticated: true,
        // Don't use `Localize` component since native html tag like `option` cannot render them
    },
    {
        path: routes.p2p_my_ads,
        component: MyAds,
        is_authenticated: true,
        // Don't use `Localize` component since native html tag like `option` cannot render them
    },
    {
        path: routes.p2p_advertiser_page,
        component: AdvertiserPage,
        is_authenticated: true,
        // Don't use `Localize` component since native html tag like `option` cannot render them
    },
    {
        path: routes.p2p_my_profile,
        component: MyProfile,
        is_authenticated: true,
        // routes: [
        // {
        //     getTitle: () => localize('Profile'),
        //     icon: 'IcUserOutline',
        //     subroutes: [
        //         {
        //             path: routes.personal_details,
        //             component: PersonalDetails,
        //             getTitle: () => localize('Personal details'),
        //             default: true,
        //         },
        //     ],
        // },
        // {
        //     getTitle: () => localize('Assessments'),
        //     icon: 'IcAssessment',
        //     subroutes: [
        //         {
        //             path: routes.trading_assessment,
        //             component: TradingAssessment,
        //             getTitle: () => localize('Trading assessment'),
        //         },
        //         {
        //             path: routes.financial_assessment,
        //             component: FinancialAssessment,
        //             getTitle: () => localize('Financial assessment'),
        //         },
        //     ],
        // },
        // {
        //     getTitle: () => localize('Verification'),
        //     icon: 'IcVerification',
        //     subroutes: [
        //         {
        //             path: routes.proof_of_identity,
        //             component: ProofOfIdentity,
        //             getTitle: () => localize('Proof of identity'),
        //         },
        //         {
        //             path: routes.proof_of_address,
        //             component: ProofOfAddress,
        //             getTitle: () => localize('Proof of address'),
        //         },
        //     ],
        // },
        // {
        //     getTitle: () => localize('Security and safety'),
        //     icon: 'IcSecurity',
        //     subroutes: [
        //         {
        //             path: routes.passwords,
        //             component: Passwords,
        //             getTitle: () => localize('Email and passwords'),
        //         },
        //         {
        //             path: routes.self_exclusion,
        //             component: SelfExclusion,
        //             getTitle: () => (is_appstore ? localize('Self-exclusion') : localize('Self exclusion')),
        //         },
        //         {
        //             path: routes.account_limits,
        //             component: AccountLimits,
        //             getTitle: () => (is_appstore ? localize('Withdrawal limits') : localize('Account limits')),
        //         },
        //         {
        //             path: routes.login_history,
        //             component: LoginHistory,
        //             getTitle: () => localize('Login history'),
        //         },
        //         ...(is_appstore
        //             ? []
        //             : [
        //                   {
        //                       path: routes.api_token,
        //                       component: ApiToken,
        //                       getTitle: () => localize('API token'),
        //                   },
        //               ]),
        //         {
        //             path: routes.connected_apps,
        //             component: ConnectedApps,
        //             getTitle: () => localize('Connected apps'),
        //         },
        //         {
        //             path: routes.two_factor_authentication,
        //             component: TwoFactorAuthentication,
        //             getTitle: () => localize('Two-factor authentication'),
        //         },
        //         {
        //             path: routes.closing_account,
        //             component: ClosingAccount,
        //             getTitle: () => localize('Close your account'),
        //         },
        //     ],
        // },
        // ],
    },
];

let routesConfig;

// For default page route if page/path is not found, must be kept at the end of routes_config array
const route_default = { component: Page404, getTitle: () => localize('Error 404') };

const getRoutesConfig = () => {
    if (!routesConfig) {
        routesConfig = initRoutesConfig();
        routesConfig.push(route_default);
    }
    return routesConfig;
};

export default getRoutesConfig;
