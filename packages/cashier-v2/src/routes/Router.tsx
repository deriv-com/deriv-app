/* eslint-disable sort-keys */
import React from 'react';
import { Switch } from 'react-router-dom';
import { DummyRoute } from '../components';
import { Cashier } from '../containers';
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
                component: DummyRoute,
                title: 'Deposit',
            },
            {
                path: cashierPathRoutes.cashierWithdrawal,
                component: DummyRoute,
                title: 'Withdrawal',
            },
            {
                path: cashierPathRoutes.cashierPaymentAgents,
                component: DummyRoute,
                title: 'Payment agents',
            },
            {
                path: cashierPathRoutes.cashierAccountTransfer,
                component: DummyRoute,
                title: 'Transfer',
            },
            {
                path: cashierPathRoutes.cashierPaymentAgentTransfer,
                component: DummyRoute,
                title: 'Transfer to client',
            },
            {
                path: cashierPathRoutes.cashierOnRamp,
                component: DummyRoute,
                title: 'Fiat onramp',
            },
        ],
    },
];

export const defaultRoute = routesConfig[0].routes?.[0];

const Router = () => {
    return (
        <Switch>
            {routesConfig.map(route => (
                <RouteWithSubRoutes key={route.path} {...route} />
            ))}
        </Switch>
    );
};

export default Router;
