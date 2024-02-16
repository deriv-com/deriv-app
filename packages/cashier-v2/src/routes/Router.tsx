/* eslint-disable sort-keys */
import React from 'react';
import { Switch } from 'react-router-dom';
import { DummyComponent } from '../components';
import { Cashier } from '../containers';
import { DepositFiatModule, WithdrawalVerificationModule } from '../lib';
import { TRouteTypes } from '../types';
import RouteWithSubRoutes from './RouteWithSubRoutes';

export const cashierPathRoutes = {
    cashier: '/cashier-v2',
    cashierDeposit: '/cashier-v2/deposit',
    cashierWithdrawal: '/cashier-v2/withdrawal',
    cashierPaymentAgents: '/cashier-v2/payment-agent',
    cashierAccountTransfer: '/cashier-v2/account-transfer',
    cashierPaymentAgentTransfer: '/cashier-v2/payment-agent-transfer',
    cashierOnRamp: '/cashier-v2/on-ramp',
} as const;

const routesConfig: TRouteTypes.IRouteConfig[] = [
    {
        path: cashierPathRoutes.cashier,
        component: Cashier,
        title: 'Cashier',
        routes: [
            {
                path: cashierPathRoutes.cashierDeposit,
                component: DepositFiatModule,
                title: 'Deposit',
            },
            {
                path: cashierPathRoutes.cashierWithdrawal,
                component: WithdrawalVerificationModule,
                title: 'Withdrawal',
            },
            {
                path: cashierPathRoutes.cashierPaymentAgents,
                component: DummyComponent,
                title: 'Payment agents',
            },
            {
                path: cashierPathRoutes.cashierAccountTransfer,
                component: DummyComponent,
                title: 'Transfer',
            },
            {
                path: cashierPathRoutes.cashierPaymentAgentTransfer,
                component: DummyComponent,
                title: 'Transfer to client',
            },
            {
                path: cashierPathRoutes.cashierOnRamp,
                component: DummyComponent,
                title: 'Fiat onramp',
            },
        ],
    },
];

export const defaultRoute = routesConfig[0].routes?.[0];

const Router = () => {
    const { component: RouteComponent, path, routes, title } = routesConfig[0];

    return (
        <Switch>
            <RouteWithSubRoutes component={RouteComponent} path={path} routes={routes} title={title} />
        </Switch>
    );
};

export default Router;
