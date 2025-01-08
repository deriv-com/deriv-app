import Cookies from 'js-cookie';
import FIREBASE_INIT_DATA from '@deriv/api/src/remote_config.json';
import { getAppId, LocalStore } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import { CountryUtils } from '@deriv-com/utils';

import { MAX_MOBILE_WIDTH } from '../../Constants';
import React from 'react';

export const AnalyticsInitializer = async () => {
    const account_type = LocalStore?.get('active_loginid')
        ?.match(/[a-zA-Z]+/g)
        ?.join('');
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

            const client_information = Cookies.getJSON('client_information');

            const config = {
                growthbookKey: flags.marketing_growthbook ? process.env.GROWTHBOOK_CLIENT_KEY : undefined,
                growthbookDecryptionKey: flags.marketing_growthbook ? process.env.GROWTHBOOK_DECRYPTION_KEY : undefined,
                rudderstackKey: process.env.RUDDERSTACK_KEY,
                growthbookOptions: {
                    attributes: {
                        loggedIn: !!client_information,
                        account_type: account_type === 'null' ? 'unlogged' : account_type,
                        app_id: String(getAppId()),
                        device_type: window.innerWidth <= MAX_MOBILE_WIDTH ? 'mobile' : 'desktop',
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
                        residence_country: client_information?.residence,
                    },
                },
            };
            await Analytics?.initialise(config);
            let lastURL = window.location.href;
            setInterval(() => {
                const currentURL = window.location.href;
                if (currentURL !== lastURL) {
                    lastURL = currentURL;
                    Analytics.getInstances().ab.reapplyExperiment();
                }
            }, 100);
        }
    }
};
