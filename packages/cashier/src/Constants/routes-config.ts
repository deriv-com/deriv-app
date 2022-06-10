import React from 'react';
import { routes, moduleLoader } from '@deriv/shared';
import { Redirect } from 'react-router-dom';
import { localize } from '@deriv/translations';
import {
    Cashier,
    Deposit,
    Withdrawal,
    PaymentAgent,
    AccountTransfer,
    PaymentAgentTransfer,
    P2PCashier,
    OnRamp,
} from '../Containers';

export type TRoute = {
    default?: boolean;
    exact?: boolean | undefined;
    id?: string;
    icon_component?: string;
    is_invisible?: boolean;
    path?: string;
    to?: string;
    component: (() => JSX.Element) | typeof Page404 | typeof Redirect;
    getTitle?: () => string;
};

export type TRouteConfig = TRoute & {
    is_modal?: boolean;
    is_authenticated?: boolean;
    routes?: Array<TRoute>;
};

// Error Routes
const Page404 = React.lazy(() => moduleLoader(() => import(/* webpackChunkName: "404" */ 'Components/Page404.jsx')));

// Order matters
const initRoutesConfig = (): Array<TRouteConfig> => [
    {
        path: routes.cashier,
        component: Cashier,
        is_modal: true,
        is_authenticated: true,
        getTitle: () => localize('Cashier'),
        icon_component: 'IcCashier',
        routes: [
            {
                path: routes.cashier_deposit,
                component: Deposit,
                getTitle: () => localize('Deposit'),
                icon_component: 'IcCashierAdd',
                default: true,
            },
            {
                path: routes.cashier_withdrawal,
                component: Withdrawal,
                getTitle: () => localize('Withdrawal'),
                icon_component: 'IcCashierMinus',
            },
            {
                path: routes.cashier_pa,
                component: PaymentAgent,
                getTitle: () => localize('Payment agents'),
                icon_component: 'IcPaymentAgent',
            },
            {
                path: routes.cashier_acc_transfer,
                component: AccountTransfer,
                getTitle: () => localize('Transfer'),
                icon_component: 'IcAccountTransfer',
            },
            {
                path: routes.cashier_pa_transfer,
                component: PaymentAgentTransfer,
                getTitle: () => localize('Transfer to client'),
                icon_component: 'IcAccountTransfer',
            },
            {
                path: routes.cashier_p2p,
                // george error fixes when P2PCashier will be typed
                component: P2PCashier,
                getTitle: () => localize('Deriv P2P'),
                icon_component: 'IcDp2p',
            },
            {
                path: routes.cashier_p2p_verification,
                component: P2PCashier,
                getTitle: () => localize('Deriv P2P'),
                icon_component: 'IcDp2p',
                is_invisible: true,
            },
            {
                id: 'gtm-onramp-tab',
                path: routes.cashier_onramp,
                component: OnRamp,
                getTitle: () => localize('Fiat onramp'),
                icon_component: 'IcCashierOnRamp',
            },
        ],
    },
];

let routesConfig: undefined | Array<TRouteConfig>;

// For default page route if page/path is not found, must be kept at the end of routes_config array
const route_default: TRoute = { component: Page404, getTitle: () => localize('Error 404') };

const getRoutesConfig = () => {
    if (!routesConfig) {
        routesConfig = initRoutesConfig();
        routesConfig.push(route_default);
    }
    return routesConfig;
};

export default getRoutesConfig;
