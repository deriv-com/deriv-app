import * as React from 'react';
import { Loading } from '@deriv/components';
import { useFeatureFlags, useWalletsList } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import Wallets from '@deriv/wallets';
import Onboarding from 'Modules/onboarding';
import TradersHub from 'Modules/traders-hub';
import { WalletsModule } from 'Modules/wallets';
import { Switch } from 'react-router-dom';
import RouteWithSubroutes from './route-with-sub-routes.jsx';

const Routes: React.FC = observer(() => {
    const { is_wallet_enabled, is_next_wallet_enabled } = useFeatureFlags();
    const { has_wallet, isLoading } = useWalletsList();

    const should_show_wallets = is_wallet_enabled && has_wallet;

    if (isLoading) return <Loading />;

    return (
        <React.Suspense
            fallback={
                <div>
                    <Localize i18n_default_text='Loading...' />
                </div>
            }
        >
            <Switch>
                <RouteWithSubroutes
                    path={'/appstore/traders-hub'}
                    component={is_next_wallet_enabled ? Wallets : should_show_wallets ? WalletsModule : TradersHub}
                    getTitle={() => localize('TradersHub')}
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
