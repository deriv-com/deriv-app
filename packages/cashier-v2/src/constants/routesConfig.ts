/* eslint-disable sort-keys */
import { DummyRoute } from '../components';
import { Cashier } from '../containers';

export const cashierPathRoutes = {
    cashier: '/cashier-v2',
    cashierDeposit: '/cashier-v2/deposit',
    cashierWithdrawal: '/cashier-v2/withdrawal',
    cashierPaymentAgents: '/cashier-v2/payment-agent',
    cashierAccountTransfer: '/cashier-v2/account-transfer',
    cashierPaymentAgentTransfer: '/cashier-v2/payment-agent-transfer',
    cashierOnRamp: '/cashier-v2/on-ramp',
} as const;

export interface IRouteConfig {
    component: React.ComponentType<IRouteConfig>;
    path: string;
    routes?: IRouteConfig[];
    title: string;
}

export type TRouteComponent = React.ComponentProps<IRouteConfig['component']>;

export const routesConfig: IRouteConfig[] = [
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
