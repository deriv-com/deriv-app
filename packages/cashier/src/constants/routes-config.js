import React from 'react';
import { routes, moduleLoader } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { Cashier } from '../containers';
import { AccountTransfer, Deposit, OnRamp, P2PCashier, PaymentAgent, PaymentAgentTransfer, Withdrawal } from '../pages';

// Error Routes
const Page404 = React.lazy(() => moduleLoader(() => import(/* webpackChunkName: "404" */ 'Components/page-404')));

// Order matters
const initRoutesConfig = is_cra => {
    const cashier_module = [
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
                    is_visible_for: [],
                    default: true,
                },
                {
                    path: routes.cashier_withdrawal,
                    component: Withdrawal,
                    getTitle: () => localize('Withdrawal'),
                    icon_component: 'IcCashierMinus',
                    is_visible_for: ['affiliate'],
                },
                {
                    path: routes.cashier_pa,
                    component: PaymentAgent,
                    getTitle: () => localize('Payment agents'),
                    icon_component: 'IcPaymentAgent',
                    is_visible_for: [],
                },
                {
                    path: routes.cashier_acc_transfer,
                    component: AccountTransfer,
                    getTitle: () => localize('Transfer'),
                    icon_component: 'IcAccountTransfer',
                    is_visible_for: ['affiliate'],
                },
                {
                    path: routes.cashier_pa_transfer,
                    component: PaymentAgentTransfer,
                    getTitle: () => localize('Transfer to client'),
                    icon_component: 'IcAccountTransfer',
                    is_visible_for: [],
                },
                {
                    path: routes.cashier_p2p,
                    component: P2PCashier,
                    getTitle: () => localize('Deriv P2P'),
                    icon_component: 'IcDp2p',
                    is_visible_for: [],
                },
                {
                    path: routes.cashier_p2p_verification,
                    component: P2PCashier,
                    getTitle: () => localize('Deriv P2P'),
                    icon_component: 'IcDp2p',
                    is_invisible: true,
                    is_visible_for: [],
                },
                {
                    id: 'gtm-onramp-tab',
                    path: routes.cashier_onramp,
                    component: OnRamp,
                    getTitle: () => localize('Fiat onramp'),
                    icon_component: 'IcCashierOnRamp',
                    is_visible_for: [],
                },
            ],
        },
    ];

    if (is_cra) {
        cashier_module.forEach(cashier => {
            if (cashier.routes) {
                cashier.routes = cashier.routes.filter(route => route.is_visible_for.includes('affiliate'));
            }
        });
    }

    return cashier_module;
};

let routes_config, cra_routes_config;
// For default page route if page/path is not found, must be kept at the end of routes_config array
const route_default = { component: Page404, getTitle: () => localize('Error 404') };

const getRoutesConfig = is_cra => {
    if (!routes_config && !cra_routes_config) {
        routes_config = initRoutesConfig(false);
        routes_config.push(route_default);
        cra_routes_config = initRoutesConfig(true);
        cra_routes_config.push(route_default);
    }
    return is_cra ? cra_routes_config : routes_config;
};

export default getRoutesConfig;
