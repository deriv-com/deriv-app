import React from 'react';
import Loadable from 'react-loadable';
import { Loading } from '@deriv/components';
import { addRoutesConfig } from '@deriv/shared/utils/route';
import { localize } from '@deriv/translations';
// TODO remove this once deriv-shared is updated
import routes from './routes';

// Error Routes
const Page404 = React.lazy(() => import(/* webpackChunkName: "404" */ 'Modules/Page404'));

const handleLoading = (props) => {
    // 200ms default
    if (props.pastDelay) {
        return <Loading />;
    }
    return null;
};

const makeLazyLoader = (importFn) => (component_name) =>
    Loadable.Map({
        loader: {
            ComponentModule: importFn,
        },
        render(loaded, props) {
            const ComponentLazy = loaded.ComponentModule.default[component_name];
            return <ComponentLazy {...props} />;
        },
        loading: handleLoading,
    });

const lazyLoadAccountComponent = makeLazyLoader(() => import(/* webpackChunkName: "account-sections" */ 'Sections'));

// Order matters
const initRoutesConfig = () => [
    {
        path: routes.account,
        component: lazyLoadAccountComponent('Account'),
        is_authenticated: true,
        title: localize('Account Settings'),
        icon_component: 'IcUserOutline',
        routes: [
            {
                title: localize('Profile'),
                icon: 'IcUserOutline',
                subroutes: [
                    {
                        path: routes.personal_details,
                        component: lazyLoadAccountComponent('PersonalDetails'),
                        title: localize('Personal details'),
                        default: true,
                    },
                    {
                        path: routes.financial_assessment,
                        component: lazyLoadAccountComponent('FinancialAssessment'),
                        title: localize('Financial assessment'),
                    },
                ],
            },
            {
                title: localize('Verification'),
                icon: 'IcVerification',
                subroutes: [
                    {
                        path: routes.proof_of_identity,
                        component: lazyLoadAccountComponent('ProofOfIdentity'),
                        title: localize('Proof of identity'),
                    },
                    {
                        path: routes.proof_of_address,
                        component: lazyLoadAccountComponent('ProofOfAddress'),
                        title: localize('Proof of address'),
                    },
                ],
            },
            {
                title: localize('Security and safety'),
                icon: 'IcSecurity',
                subroutes: [
                    {
                        path: routes.deriv_password,
                        component: lazyLoadAccountComponent('DerivPassword'),
                        title: localize('Deriv password'),
                    },
                    {
                        path: routes.account_limits,
                        component: lazyLoadAccountComponent('AccountLimits'),
                        title: localize('Account limits'),
                    },
                ],
            },
        ],
    },
];

let routesConfig;

// For default page route if page/path is not found, must be kept at the end of routes_config array
const route_default = { component: Page404, title: localize('Error 404') };

const getRoutesConfig = () => {
    if (!routesConfig) {
        routesConfig = initRoutesConfig();
        routesConfig.push(route_default);
        addRoutesConfig(routesConfig);
    }
    return routesConfig;
};

export default getRoutesConfig;
