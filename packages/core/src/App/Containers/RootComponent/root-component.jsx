import React, { useEffect } from 'react';

import { useIsHubRedirectionEnabled, useOauth2 } from '@deriv/hooks';
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
    const {
        is_wallets_onboarding_tour_guide_visible,
        setIsWalletsOnboardingTourGuideVisible,
        notification_messages_ui,
    } = ui;
    const { has_wallet, logout, account_settings, prevent_redirect_to_hub } = client;
    const { trading_hub } = account_settings;

    const { oAuthLogout } = useOauth2({ handleLogout: logout });

    const onWalletsOnboardingTourGuideCloseHandler = () => {
        setIsWalletsOnboardingTourGuideVisible(false);
    };
    const { isHubRedirectionEnabled } = useIsHubRedirectionEnabled();

    const PRODUCTION_URL = 'app.deriv.com';
    const PRODUCTION_REDIRECT_URL = 'https://hub.deriv.com/tradershub/options';
    const STAGING_REDIRECT_URL = 'https://staging-hub.deriv.com/tradershub/options';

    useEffect(() => {
        if (isHubRedirectionEnabled && !!trading_hub && !prevent_redirect_to_hub) {
            const redirectUrl =
                window.location.hostname === PRODUCTION_URL ? PRODUCTION_REDIRECT_URL : STAGING_REDIRECT_URL;
            window.location.assign(redirectUrl);
        }
    }, [isHubRedirectionEnabled, trading_hub, prevent_redirect_to_hub]);

    return has_wallet ? (
        <Wallets
            isWalletsOnboardingTourGuideVisible={is_wallets_onboarding_tour_guide_visible}
            logout={async () => {
                await oAuthLogout();
            }}
            notificationMessagesUi={notification_messages_ui}
            onWalletsOnboardingTourGuideCloseHandler={onWalletsOnboardingTourGuideCloseHandler}
        />
    ) : (
        <AppStore {...props} />
    );
});

export default RootComponent;
