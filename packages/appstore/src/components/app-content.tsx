import React from 'react';
import { useFeatureFlags } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { Route, Switch } from 'react-router';
import Onboarding from '../modules/onboarding';
import TradersHub from '../modules/traders-hub';
import { WalletsModule } from '../modules/wallets';
import './app.scss';

const AppContent: React.FC = observer(() => {
    const { is_wallet_enabled } = useFeatureFlags();

    return (
        <Switch>
            <Route
                path={'/appstore/traders-hub'}
                render={() => {
                    document.title = `${localize("Trader's Hub")} | Deriv`;

                    return is_wallet_enabled ? <WalletsModule /> : <TradersHub />;
                }}
            />
            <Route
                path={'/appstore/onboarding'}
                render={() => {
                    document.title = `${localize('Onboarding')} | Deriv`;

                    return <Onboarding />;
                }}
            />
        </Switch>
    );
});

export default AppContent;
