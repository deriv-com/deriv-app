import Cookies from 'js-cookie';

import FIREBASE_INIT_DATA from '@deriv/api/src/remote_config.json';
import { getAppId, LocalStore } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import { CountryUtils } from '@deriv-com/utils';

export const AnalyticsInitializer = async () => {
    const account_type = LocalStore?.get('active_loginid')
        ?.match(/[a-zA-Z]+/g)
        ?.join('');
    if (process.env.REMOTE_CONFIG_URL) {
        const flags = await fetch(process.env.REMOTE_CONFIG_URL)
            .then(res => res.json())
            .catch(() => FIREBASE_INIT_DATA);
        if (process.env.RUDDERSTACK_KEY && flags?.tracking_rudderstack) {
            const utm_cookie = Cookies.get('utm_data');
            const ppc_campaign_cookies =
                utm_cookie === 'null' || !utm_cookie
                    ? {
                          utm_source: 'no source',
                          utm_medium: 'no medium',
                          utm_campaign: 'no campaign',
                          utm_content: 'no content',
                      }
                    : JSON.parse(utm_cookie);

            let residence_country;
            const client_information = Cookies.get('client_information')
                ? JSON.parse(Cookies.get('client_information') || '{}')
                : null;
            if (client_information) {
                residence_country = client_information.residence;
            } else {
                residence_country = '';
            }

            const analytics_config_config = {
                loggedIn: !!client_information,
                account_type: account_type === 'null' ? 'unlogged' : account_type,
                app_id: String(getAppId()),
                device_language: navigator?.language || 'en-EN',
                user_language: getLanguage().toLowerCase(),
                country: await CountryUtils.getCountry(),
                utm_source: ppc_campaign_cookies?.utm_source,
                utm_medium: ppc_campaign_cookies?.utm_medium,
                utm_campaign: ppc_campaign_cookies?.utm_campaign,
                utm_content: ppc_campaign_cookies?.utm_content,
                domain: window.location.hostname,
                url: window.location.href,
                network_type: navigator.connection?.effectiveType,
                network_rtt: navigator.connection?.rtt,
                network_downlink: navigator.connection?.downlink,
                residence_country,
            };
            const config = {
                growthbookKey: flags.marketing_growthbook ? process.env.GROWTHBOOK_CLIENT_KEY : undefined,
                growthbookDecryptionKey: flags.marketing_growthbook ? process.env.GROWTHBOOK_DECRYPTION_KEY : undefined,
                rudderstackKey: process.env.RUDDERSTACK_KEY,
                growthbookOptions: {
                    attributes: {
                        ...analytics_config_config,
                    },
                },
            };
            Analytics.setAttributes(analytics_config_config);
            await Analytics?.initialise(config);
        }
    }
};
