import { POAFormContainer } from '../../modules/POAForm/POAFormContainer';
import DummyRoute from '../components/dummy-route/dummy-route';

export const routes = [
    {
        routeComponent: DummyRoute,
        routeName: 'Personal details',
        routePath: '/account-v2/personal_details',
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Languages',
        routePath: '/account-v2/languages',
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Trading assessment',
        routePath: '/account-v2/trading_assessment',
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Financial assessment',
        routePath: '/account-v2/financial_assessment',
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Proof of identity',
        routePath: '/account-v2/proof_of_identity',
    },
    {
        routeComponent: POAFormContainer,
        routeName: 'Proof of address',
        routePath: '/account-v2/proof_of_address',
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Proof of ownership',
        routePath: '/account-v2/proof_of_ownership',
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Proof of income',
        routePath: '/account-v2/proof_of_income',
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Email and passwords',
        routePath: '/account-v2/email_and_passwords',
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Self exclusion',
        routePath: '/account-v2/self_exclusion',
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Account limits',
        routePath: '/account-v2/account_limits',
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Login history',
        routePath: '/account-v2/login_history',
    },
    {
        routeComponent: DummyRoute,
        routeName: 'API token',
        routePath: '/account-v2/api_token',
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Connected apps',
        routePath: '/account-v2/connected_apps',
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Two-factor authentication',
        routePath: '/account-v2/two_factor_authentication',
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Close your account',
        routePath: '/account-v2/close_your_account',
    },
];

export const defaultRoute = routes[0].routePath;
