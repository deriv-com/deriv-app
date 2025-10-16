import React from 'react';

import { getUrlP2P, moduleLoader, routes } from '@deriv/shared';
import { localize } from '@deriv/translations';

import { CashierLockedChecker } from '../components/cashier-locked-checker';
import { Cashier } from '../containers';
import { AccountTransfer, Deposit, PaymentAgent, PaymentAgentTransfer, Withdrawal } from '../pages';
import { TRoute, TRouteConfig } from '../types';

// Error Routes
const Page404 = React.lazy(() => moduleLoader(() => import(/* webpackChunkName: "404" */ '../components/page-404')));
export type TPage404 = typeof Page404;

// Order matters
const initRoutesConfig = (): TRouteConfig[] => [
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
                component: () => (
                    <CashierLockedChecker>
                        <Deposit />
                    </CashierLockedChecker>
                ),
                getTitle: () => localize('Deposit'),
                icon_component: 'IcCashierAdd',
                default: true,
            },
            {
                path: routes.cashier_withdrawal,
                component: () => (
                    <CashierLockedChecker>
                        <Withdrawal />
                    </CashierLockedChecker>
                ),
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
                component: () => {
                    window.location.href = getUrlP2P(false);
                    return null;
                },
                getTitle: () => localize('Deriv P2P'),
                icon_component: 'IcDp2p',
            },
        ],
    },
];

let routesConfig: undefined | TRouteConfig[];

// For default page route if page/path is not found, must be kept at the end of routes_config array
const route_default: TRoute = { component: Page404, getTitle: () => localize('Error 404') };

const getRoutesConfig = (): TRouteConfig[] => {
    if (!routesConfig) {
        routesConfig = initRoutesConfig();
        routesConfig.push(route_default);
    }
    return routesConfig;
};

export default getRoutesConfig;
