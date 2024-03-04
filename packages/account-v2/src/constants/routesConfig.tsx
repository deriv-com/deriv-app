import { POICountrySelector } from '../containers/POICountrySelector';
import { POAFormContainer } from '../modules/POAForm/POAFormContainer';
import { DummyRoute } from '../router/components/DummyRoute';
import { accountV2Routes } from './routes';

export const routes = [
    {
        routeComponent: DummyRoute,
        routeName: 'Personal details',
        routePath: accountV2Routes.PersonalDetails,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Languages',
        routePath: accountV2Routes.Languages,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Trading assessment',
        routePath: accountV2Routes.TradingAssessment,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Financial assessment',
        routePath: accountV2Routes.FinancialAssessment,
    },
    {
        routeComponent: POICountrySelector,
        routeName: 'Proof of identity',
        routePath: accountV2Routes.ProofOfIdentity,
    },
    {
        routeComponent: POAFormContainer,
        routeName: 'Proof of address',
        routePath: accountV2Routes.ProofOfAddress,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Proof of ownership',
        routePath: accountV2Routes.ProofOfOwnership,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Proof of income',
        routePath: accountV2Routes.ProofOfIncome,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Email and passwords',
        routePath: accountV2Routes.EmailAndPassword,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Self exclusion',
        routePath: accountV2Routes.SelfExclusion,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Account limits',
        routePath: accountV2Routes.AccountLimits,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Login history',
        routePath: accountV2Routes.LoginHistory,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'API token',
        routePath: accountV2Routes.ApiToken,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Connected apps',
        routePath: accountV2Routes.ConnectedApps,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Two-factor authentication',
        routePath: accountV2Routes.TwoFactorAuthentication,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Close your account',
        routePath: accountV2Routes.CloseAccount,
    },
];

export const defaultRoute = routes[0].routePath;
