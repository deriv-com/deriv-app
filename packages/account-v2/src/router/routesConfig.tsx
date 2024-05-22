import { ACCOUNT_V2_ROUTES } from '../constants/routes';
import { PersonalDetailsForm } from '../containers/PersonalDetailsForm';
import { ProofOfIncomeForm } from '../containers/ProofOfIncome';
import { TradingAssessmentForm } from '../containers/TradingAssessmentForm';
import { FinancialAssessmentForm } from '../modules/src/FinancialAssessment/FinancialAssessmentForm';
import { POAFormContainer } from '../modules/src/POAForm/POAFormContainer';
import { ProofOfIdentity } from '../modules/src/POI/POI';
import {
    AccountClosure,
    AccountLimits,
    ConnectedApps,
    LoginHistory,
    ProofOfOwnership,
    TwoFactorAuthentication,
} from '../pages';
import { DummyRoute } from './components/DummyRoute/DummyRoute';

export const routes = [
    {
        routeComponent: PersonalDetailsForm,
        routeName: 'Personal details',
        routePath: ACCOUNT_V2_ROUTES.PersonalDetails,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Languages',
        routePath: ACCOUNT_V2_ROUTES.Languages,
    },
    {
        routeComponent: TradingAssessmentForm,
        routeName: 'Trading assessment',
        routePath: ACCOUNT_V2_ROUTES.TradingAssessment,
    },
    {
        routeComponent: FinancialAssessmentForm,
        routeName: 'Financial assessment',
        routePath: ACCOUNT_V2_ROUTES.FinancialAssessment,
    },
    {
        routeComponent: ProofOfIdentity,
        routeName: 'Proof of identity',
        routePath: ACCOUNT_V2_ROUTES.ProofOfIdentity,
    },
    {
        routeComponent: POAFormContainer,
        routeName: 'Proof of address',
        routePath: ACCOUNT_V2_ROUTES.ProofOfAddress,
    },
    {
        routeComponent: ProofOfOwnership,
        routeName: 'Proof of ownership',
        routePath: ACCOUNT_V2_ROUTES.ProofOfOwnership,
    },
    {
        routeComponent: ProofOfIncomeForm,
        routeName: 'Proof of income',
        routePath: ACCOUNT_V2_ROUTES.ProofOfIncome,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Email and passwords',
        routePath: ACCOUNT_V2_ROUTES.EmailAndPassword,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'Self exclusion',
        routePath: ACCOUNT_V2_ROUTES.SelfExclusion,
    },
    {
        routeComponent: AccountLimits,
        routeName: 'Account limits',
        routePath: ACCOUNT_V2_ROUTES.AccountLimits,
    },
    {
        routeComponent: LoginHistory,
        routeName: 'Login history',
        routePath: ACCOUNT_V2_ROUTES.LoginHistory,
    },
    {
        routeComponent: DummyRoute,
        routeName: 'API token',
        routePath: ACCOUNT_V2_ROUTES.ApiToken,
    },
    {
        routeComponent: ConnectedApps,
        routeName: 'Connected apps',
        routePath: ACCOUNT_V2_ROUTES.ConnectedApps,
    },
    {
        routeComponent: TwoFactorAuthentication,
        routeName: 'Two-factor authentication',
        routePath: ACCOUNT_V2_ROUTES.TwoFactorAuthentication,
    },
    {
        routeComponent: AccountClosure,
        routeName: 'Close your account',
        routePath: ACCOUNT_V2_ROUTES.CloseAccount,
    },
];

export const defaultRoute = routes[0].routePath;
