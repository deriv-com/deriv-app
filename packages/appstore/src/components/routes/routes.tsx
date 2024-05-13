import * as React from 'react';
import { Loading } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { Switch } from 'react-router-dom';
import RouteWithSubroutes from './route-with-sub-routes.jsx';

const Onboarding = React.lazy(() => import(/* webpackChunkName: "modules-onboarding" */ 'Modules/onboarding'));
const TradersHub = React.lazy(() => import(/* webpackChunkName: "modules-traders-hub" */ 'Modules/traders-hub'));
const Wallets = React.lazy(() => import(/* webpackChunkName: "wallets" */ '@deriv/wallets'));

const Routes: React.FC = observer(() => {
    return (
        <React.Suspense fallback={<Loading />}>
            <Switch>
                <RouteWithSubroutes
                    path={'/appstore/traders-hub'}
                    component={false ? Wallets : TradersHub}
                    getTitle={() => localize("Trader's Hub")}
                />
                <RouteWithSubroutes
                    path={'/appstore/onboarding'}
                    component={Onboarding}
                    getTitle={() => localize('Onboarding')}
                />
            </Switch>
        </React.Suspense>
    );
});

export default Routes;
