import * as React from 'react';
import { Loading } from '@deriv/components';
import { useFeatureFlags /*useWalletsList*/ } from '@deriv/hooks';
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
    const { is_logged_in } = client;
    //TODO: Uncomment once useWalletList hook is optimized for production release.
    const { /*is_wallet_enabled,*/ is_next_wallet_enabled } = useFeatureFlags();
    const history = useHistory();
    // const { has_wallet, isLoading } = useWalletsList();
    // const should_show_wallets = is_wallet_enabled && has_wallet;

    const title_TH = localize("Trader's Hub");
    const title_TH_logged_out = localize('Deriv App');

    React.useLayoutEffect(() => {
        if (is_next_wallet_enabled) history.push(routes.wallets);
    }, [history, is_next_wallet_enabled]);

    return (
        <React.Suspense fallback={<Loading />}>
            <Switch>
                <RouteWithSubroutes path={routes.traders_hub} component={TradersHub} getTitle={() => title_TH} />
                <RouteWithSubroutes
                    path={routes.onboarding}
                    component={Onboarding}
                    getTitle={() => localize('Onboarding')}
                />
                <RouteWithSubroutes
                    path={routes.root}
                    component={is_logged_in ? TradersHub : TradersHubLoggedOut}
                    getTitle={() => (is_logged_in ? title_TH : title_TH_logged_out)}
                />
            </Switch>
        </React.Suspense>
    );
});

export default Routes;
