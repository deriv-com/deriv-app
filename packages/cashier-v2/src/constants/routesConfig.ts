/* eslint-disable sort-keys */
import { DummyRoute } from '../components';
import { Cashier } from '../containers';

export interface IRouteConfig {
    component: React.ComponentType<IRouteConfig>;
    path: string;
    routes?: IRouteConfig[];
    title: string;
}

export type TRouteComponent = React.ComponentProps<IRouteConfig['component']>;

export const routesConfig: IRouteConfig[] = [
    {
        path: '/cashier-v2',
        component: Cashier,
        title: 'Cashier',
        routes: [
            {
                path: '/cashier-v2/deposit',
                component: DummyRoute,
                title: 'Deposit',
            },
            {
                path: '/cashier-v2/withdrawal',
                component: DummyRoute,
                title: 'Withdrawal',
            },
            {
                path: '/cashier-v2/payment-agent',
                component: DummyRoute,
                title: 'Payment agents',
            },
            {
                path: '/cashier-v2/account-transfer',
                component: DummyRoute,
                title: 'Transfer',
            },
            {
                path: '/cashier-v2/payment-agent-transfer',
                component: DummyRoute,
                title: 'Transfer to client',
            },
            {
                path: '/cashier-v2/on-ramp',
                component: DummyRoute,
                title: 'Fiat onramp',
            },
        ],
    },
];

export const defaultRoute = routesConfig[0].routes?.[0];
