import * as React from 'react';
import { Loading } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import { Switch, useHistory } from 'react-router-dom';
import RouteWithSubroutes from './route-with-sub-routes.jsx';

const Onboarding = React.lazy(() => import(/* webpackChunkName: "modules-onboarding" */ 'Modules/onboarding'));
const TradersHub = React.lazy(() => import(/* webpackChunkName: "modules-traders-hub" */ 'Modules/traders-hub'));
const TradersHubLoggedOut = React.lazy(
    () => import(/* webpackChunkName: "modules-traders-hub-logged-out" */ 'Modules/traders-hub-logged-out')
);

const Routes: React.FC = observer(() => {
    const { client } = useStore();
    const { is_logged_in, has_wallet } = client;
    const history = useHistory();

    const title_TH = localize("Trader's Hub");
    const title_TH_logged_out = localize('Deriv App');

    React.useLayoutEffect(() => {
        if (has_wallet) history.push(routes.wallets);
    }, [history, has_wallet]);

    return (
        <React.Suspense fallback={<Loading />}>
            <Switch>
                <RouteWithSubroutes
                    path={routes.traders_hub}
                    component={is_logged_in ? TradersHub : TradersHubLoggedOut}
                    getTitle={() => (is_logged_in ? title_TH : title_TH_logged_out)}
                />
                <RouteWithSubroutes
                    path={routes.onboarding}
                    component={Onboarding}
                    getTitle={() => localize('Onboarding')}
                />
            </Switch>
        </React.Suspense>
    );
});

export default Routes;
