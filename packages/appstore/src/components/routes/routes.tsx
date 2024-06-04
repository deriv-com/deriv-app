import * as React from 'react';
import { Loading } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import { Switch } from 'react-router-dom';
import RouteWithSubroutes from './route-with-sub-routes.jsx';

const Onboarding = React.lazy(() => import(/* webpackChunkName: "modules-onboarding" */ 'Modules/onboarding'));
const TradersHub = React.lazy(() => import(/* webpackChunkName: "modules-traders-hub" */ 'Modules/traders-hub'));
const TradersHubLoggedOut = React.lazy(
    () => import(/* webpackChunkName: "modules-traders-hub-logged-out" */ 'Modules/traders-hub-logged-out')
);
const Page404 = React.lazy(() => import(/* */ 'Modules/Page404'));

const Routes: React.FC = observer(() => {
    const { client } = useStore();
    const { is_logged_in, is_logging_in } = client;

    const title_TH = localize("Trader's Hub");
    const title_TH_logged_out = localize('Deriv App');

    const componentToRender = () => {
        if (is_logged_in || is_logging_in) {
            return TradersHub;
        }
        return TradersHubLoggedOut;
    };

    return (
        <React.Suspense fallback={<Loading />}>
            <Switch>
                <RouteWithSubroutes
                    path={routes.traders_hub}
                    exact
                    component={componentToRender()}
                    getTitle={() => (is_logged_in || is_logging_in ? title_TH : title_TH_logged_out)}
                />
                <RouteWithSubroutes
                    path={routes.onboarding}
                    exact
                    component={Onboarding}
                    getTitle={() => localize('Onboarding')}
                />
                <RouteWithSubroutes component={Page404} getTitle={() => localize('Deriv App')} />
            </Switch>
        </React.Suspense>
    );
});

export default Routes;
