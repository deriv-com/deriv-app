import Cookies from 'js-cookie';

import FIREBASE_INIT_DATA from '@deriv/api/src/remote_config.json';
import { getAppId, redirectToLogin } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import {
    OAuth2Logout,
    requestOidcAuthentication,
    TOAuth2EnabledAppList,
    useIsOAuth2Enabled,
} from '@deriv-com/auth-client';
import { CountryUtils } from '@deriv-com/utils';

import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';

/**
 * Provides an object with two properties: `isOAuth2Enabled` and `oAuthLogout`.
 *
 * `isOAuth2Enabled` is a boolean that indicates whether OAuth2 is enabled.
 *
 * `oAuthLogout` is a function that logs out the user of the OAuth2-enabled app.
 *
 * The `handleLogout` argument is an optional function that will be called after logging out the user.
 * If `handleLogout` is not provided, the function will resolve immediately.
 *
 * @param {{ handleLogout?: () => Promise<void> }} [options] - An object with an optional `handleLogout` property.
 * @returns {{ isOAuth2Enabled: boolean; oAuthLogout: () => Promise<void> }}
 */
const useOauth2 = ({ handleLogout }: { handleLogout: () => Promise<void> }) => {
    const [oAuth2EnabledApps, OAuth2EnabledAppsInitialised] = useGrowthbookGetFeatureValue<string>({
        featureFlag: 'hydra_be',
    }) as unknown as [TOAuth2EnabledAppList, boolean];

    const isOAuth2Enabled = useIsOAuth2Enabled(oAuth2EnabledApps, OAuth2EnabledAppsInitialised);

    const loginHandler = async () => {
        if (isOAuth2Enabled) {
            await requestOidcAuthentication({
                redirectCallbackUri: `${window.location.origin}/callback`,
            });
        }
        redirectToLogin(false, getLanguage());
    };

    const logoutHandler = async () => {
        if (process.env.REMOTE_CONFIG_URL) {
            const flags = await fetch(process.env.REMOTE_CONFIG_URL)
                .then(res => res.json())
                .catch(() => FIREBASE_INIT_DATA);
            if (process.env.RUDDERSTACK_KEY && flags?.tracking_rudderstack) {
                const ppc_campaign_cookies =
                    Cookies.getJSON('utm_data') === 'null'
                        ? {
                              utm_source: 'no source',
                              utm_medium: 'no medium',
                              utm_campaign: 'no campaign',
                              utm_content: 'no content',
                          }
                        : Cookies.getJSON('utm_data');

                const analytics_config_config = {
                    loggedIn: false,
                    account_type: 'unlogged',
                    app_id: String(getAppId()),
                    device_language: navigator?.language || 'en-EN',
                    user_language: getLanguage().toLowerCase(),
                    country: undefined,
                    utm_source: ppc_campaign_cookies?.utm_source,
                    utm_medium: ppc_campaign_cookies?.utm_medium,
                    utm_campaign: ppc_campaign_cookies?.utm_campaign,
                    utm_content: ppc_campaign_cookies?.utm_content,
                    domain: window.location.hostname,
                    url: window.location.href,
                    network_type: navigator.connection?.effectiveType,
                    network_rtt: navigator.connection?.rtt,
                    network_downlink: navigator.connection?.downlink,
                    residence_country: undefined,
                };
                const config = {
                    growthbookKey: flags.marketing_growthbook ? process.env.GROWTHBOOK_CLIENT_KEY : undefined,
                    growthbookDecryptionKey: flags.marketing_growthbook
                        ? process.env.GROWTHBOOK_DECRYPTION_KEY
                        : undefined,
                    rudderstackKey: process.env.RUDDERSTACK_KEY,
                    growthbookOptions: {
                        attributes: {
                            ...analytics_config_config,
                            residence_country: undefined,
                        },
                    },
                };
                Analytics.setAttributes(analytics_config_config);
                await Analytics?.initialise(config);
                // Set attributes one final time to ensure the override took effect
            }
        }
        // Proceed with OAuth logout
        await OAuth2Logout(handleLogout);
    };
    return { isOAuth2Enabled, oAuthLogout: logoutHandler, loginHandler };
};

export default useOauth2;
