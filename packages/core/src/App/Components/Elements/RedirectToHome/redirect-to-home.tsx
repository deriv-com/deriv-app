import React from 'react';

import { deriv_urls, isProduction } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

import RedirectToHomeBanner from './redirect-to-home-banner';
import RedirectToHomePopup from './redirect-to-home-popup';

import './redirect-to-home.scss';

export const REDIRECT_TO_HOME_DISMISSED_KEY = 'redirect_to_home_popup_dismissed';

const RedirectToHome = observer(() => {
    const { client } = useStore();
    const { is_logged_in, is_authorize, is_client_store_initialized } = client;

    const [is_dismissed, setIsDismissed] = React.useState(
        () => sessionStorage.getItem(REDIRECT_TO_HOME_DISMISSED_KEY) === 'true'
    );

    const is_ready = is_logged_in && is_authorize && is_client_store_initialized;

    const handleContinue = React.useCallback(() => {
        const home_url = isProduction() ? deriv_urls.HOME_PRODUCTION : deriv_urls.HOME_STAGING;
        window.location.assign(`${home_url}/dashboard/`);
    }, []);

    const handleDismiss = React.useCallback(() => {
        sessionStorage.setItem(REDIRECT_TO_HOME_DISMISSED_KEY, 'true');
        setIsDismissed(true);
    }, []);

    if (!is_ready) return null;

    return is_dismissed ? (
        <RedirectToHomeBanner onContinue={handleContinue} />
    ) : (
        <RedirectToHomePopup onContinue={handleContinue} onDismiss={handleDismiss} />
    );
});

export default RedirectToHome;
