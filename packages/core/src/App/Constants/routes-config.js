import React from 'react';
import { Redirect as RouterRedirect } from 'react-router-dom';
import { getUrlBase, routes } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { makeLazyLoader } from '_common/lazy-load';
import { Redirect } from 'App/Containers/Redirect';
import Endpoint from 'Modules/Endpoint';
import CashierNotifications from 'Modules/Cashier/Containers/cashier-notifications.jsx';

// Error Routes
const Page404 = React.lazy(() => import(/* webpackChunkName: "404" */ 'Modules/Page404'));

const Trader = React.lazy(() => {
    const el_head = document.querySelector('head');
    const el_main_css = document.createElement('link');
    el_main_css.href = getUrlBase('/css/trader.main.css');
    el_main_css.rel = 'stylesheet';
    el_main_css.type = 'text/css';
    el_head.appendChild(el_main_css);
    // eslint-disable-next-line import/no-unresolved
    return import(/* webpackChunkName: "trader" */ '@deriv/trader');
});

const Account = React.lazy(() => {
    const el_head = document.querySelector('head');
    const el_main_css = document.createElement('link');
    el_main_css.href = getUrlBase('/account/css/account.css');
    el_main_css.rel = 'stylesheet';
    el_main_css.type = 'text/css';
    el_head.appendChild(el_main_css);
    // eslint-disable-next-line import/no-unresolved
    return import(/* webpackChunkName: "account" */ '@deriv/account');
});

const Bot = React.lazy(() => {
    // eslint-disable-next-line import/no-unresolved
    return import(/* webpackChunkName: "bot" */ '@deriv/bot-web-ui');
});

const modules = [
    {
        path: routes.bot,
        component: Bot,
        title: localize('Bot'),
    },
    {
        path: routes.account_deactivated,
        component: Account,
        title: localize('Account deactivated'),
    },
    {
        path: routes.account,
        component: Account,
        title: localize('Accounts Settings'),
        icon_component: 'IcUserOutline',
        is_authenticated: true,
        // TODO: Revisit this workaround for subroutes [app-routing]
        routes: [
            {
                title: localize('Profile'),
                icon: 'IcUserOutline',
                subroutes: [
                    {
                        path: routes.personal_details,
                        component: Account,
                        title: localize('Personal details'),
                        default: true,
                    },
                    {
                        path: routes.financial_assessment,
                        component: Account,
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
                        component: Account,
                        title: localize('Proof of identity'),
                    },
                    {
                        path: routes.proof_of_address,
                        component: Account,
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
                        component: Account,
                        title: localize('Deriv password'),
                    },
                    {
                        path: routes.self_exclusion,
                        component: Account,
                        title: localize('Self exclusion'),
                    },
                    {
                        path: routes.account_limits,
                        component: Account,
                        title: localize('Account limits'),
                    },
                    {
                        path: routes.login_history,
                        component: Account,
                        title: localize('Login history'),
                    },
                    {
                        path: routes.api_token,
                        component: Account,
                        title: localize('API token'),
                    },
                    {
                        path: routes.connected_apps,
                        component: Account,
                        title: localize('Connected apps'),
                    },
                    {
                        path: routes.two_factor_authentication,
                        component: Account,
                        title: localize('Two-factor authentication'),
                    },
                    {
                        path: routes.deactivate_account,
                        component: Account,
                        title: localize('Deactivate account'),
                    },
                ],
            },
        ],
    },
    {
        path: routes.root,
        component: Trader,
        title: localize('Trader'),
        routes: [
            { path: routes.mt5, component: Trader, title: localize('MT5'), is_authenticated: false },
            {
                path: routes.reports,
                component: Trader,
                title: localize('Reports'),
                icon_component: 'IcReports',
                is_authenticated: true,
                routes: [
                    {
                        path: routes.positions,
                        component: Trader,
                        title: localize('Open positions'),
                        icon_component: 'IcOpenPositions',
                        default: true,
                    },
                    {
                        path: routes.profit,
                        component: Trader,
                        title: localize('Profit table'),
                        icon_component: 'IcProfitTable',
                    },
                    {
                        path: routes.statement,
                        component: Trader,
                        title: localize('Statement'),
                        icon_component: 'IcStatement',
                    },
                ],
            },
            { path: routes.contract, component: Trader, title: localize('Contract Details'), is_authenticated: true },
            { path: routes.error404, component: Trader, title: localize('Error 404') },
        ],
    },
];

const lazyLoadCashierComponent = makeLazyLoader(() => import(/* webpackChunkName: "cashier" */ 'Modules/Cashier'));

const lazyLoadComplaintsPolicy = makeLazyLoader(() =>
    import(/* webpackChunkName: "complaints-policy" */ 'Modules/ComplaintsPolicy')
);

// Order matters
// TODO: search tag: test-route-parent-info -> Enable test for getting route parent info when there are nested routes
const initRoutesConfig = () => [
    { path: routes.index, component: RouterRedirect, title: '', to: routes.root },
    { path: routes.endpoint, component: Endpoint, title: 'Endpoint' }, // doesn't need localization as it's for internal use
    { path: routes.redirect, component: Redirect, title: localize('Redirect') },
    {
        counter: <CashierNotifications />,
        path: routes.cashier,
        component: lazyLoadCashierComponent('Cashier'),
        is_modal: true,
        is_authenticated: true,
        title: localize('Cashier'),
        icon_component: 'IcCashier',
        routes: [
            {
                path: routes.cashier_deposit,
                component: lazyLoadCashierComponent('Deposit'),
                title: localize('Deposit'),
                icon_component: 'IcWalletAdd',
                default: true,
            },
            {
                path: routes.cashier_withdrawal,
                component: lazyLoadCashierComponent('Withdrawal'),
                title: localize('Withdrawal'),
                icon_component: 'IcWalletMinus',
            },
            {
                path: routes.cashier_pa,
                component: lazyLoadCashierComponent('PaymentAgent'),
                title: localize('Payment agents'),
                icon_component: 'IcPaymentAgent',
            },
            {
                path: routes.cashier_acc_transfer,
                component: lazyLoadCashierComponent('AccountTransfer'),
                title: localize('Transfer'),
                icon_component: 'IcAccountTransfer',
            },
            {
                path: routes.cashier_pa_transfer,
                component: lazyLoadCashierComponent('PaymentAgentTransfer'),
                title: localize('Transfer to client'),
                icon_component: 'IcAccountTransfer',
            },
            {
                counter: <CashierNotifications />,
                path: routes.cashier_p2p,
                component: lazyLoadCashierComponent('P2PCashier'),
                title: localize('DP2P'),
                icon_component: 'IcDp2p',
            },
            {
                path: routes.cashier_onramp,
                component: lazyLoadCashierComponent('OnRamp'),
                title: localize('Fiat onramp'),
                icon_component: 'IcCashierOnRamp',
            },
        ],
    },
    {
        path: routes.complaints_policy,
        component: lazyLoadComplaintsPolicy(),
        title: localize('Complaints policy'),
        icon_component: 'IcComplaintsPolicy',
        is_authenticated: true,
    },
    ...modules,
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
