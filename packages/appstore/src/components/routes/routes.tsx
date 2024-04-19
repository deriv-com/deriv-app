import * as React from 'react';
import { Loading } from '@deriv/components';
import { useFeatureFlags /*useWalletsList*/ } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import Onboarding from 'Modules/onboarding';
import TradersHub from 'Modules/traders-hub';
import TradersHubLoggedOut from 'Modules/traders-hub-logged-out';
import { Switch, useHistory } from 'react-router-dom';
import RouteWithSubroutes from './route-with-sub-routes.jsx';

const Routes: React.FC = observer(() => {
    //TODO: Uncomment once useWalletList hook is optimized for production release.
    const { /*is_wallet_enabled,*/ is_next_wallet_enabled } = useFeatureFlags();
    const history = useHistory();
    // const { has_wallet, isLoading } = useWalletsList();
    // const should_show_wallets = is_wallet_enabled && has_wallet;

    React.useLayoutEffect(() => {
        if (is_next_wallet_enabled) history.push(routes.wallets);
    }, [history, is_next_wallet_enabled]);

    return (
        <React.Suspense fallback={<Loading />}>
            <Switch>
                <RouteWithSubroutes
                    path={routes.root}
                    component={TradersHubLoggedOut}
                    getTitle={() => localize('Deriv App')}
                />
                <RouteWithSubroutes
                    path={routes.traders_hub}
                    component={TradersHub}
                    getTitle={() => localize("Trader's Hub")}
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
