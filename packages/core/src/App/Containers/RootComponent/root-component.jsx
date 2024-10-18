import React from 'react';
import { moduleLoader } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

const AppStore = React.lazy(() =>
    moduleLoader(() => {
        // eslint-disable-next-line import/no-unresolved
        return import(/* webpackChunkName: "appstore" */ '@deriv/appstore');
    })
);

const Wallets = React.lazy(() =>
    moduleLoader(() => {
        // eslint-disable-next-line import/no-unresolved
        return import(/* webpackChunkName: "wallets" */ '@deriv/wallets');
    })
);

const RootComponent = observer(props => {
    const { client, ui } = useStore();
    const { is_wallets_onboarding_tour_guide_visible, setIsWalletsOnboardingTourGuideVisible } = ui;
    const { has_wallet } = client;

    const onWalletsOnboardingTourGuideCloseHandler = () => {
        setIsWalletsOnboardingTourGuideVisible(false);
    };

    return has_wallet ? (
        <Wallets
            isWalletsOnboardingTourGuideVisible={is_wallets_onboarding_tour_guide_visible}
            onWalletsOnboardingTourGuideCloseHandler={onWalletsOnboardingTourGuideCloseHandler}
        />
    ) : (
        <AppStore {...props} />
    );
});

export default RootComponent;
