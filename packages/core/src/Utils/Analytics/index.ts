import Cookies from 'js-cookie';

import FIREBASE_INIT_DATA from '@deriv/api/src/remote_config.json';
import { getAppId, LocalStore } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import { CountryUtils } from '@deriv-com/utils';

import { MAX_MOBILE_WIDTH } from '../../Constants';

const getGrowthBookAttributes = async client_information => {
    const account_type = LocalStore?.get('active_loginid')
        ?.match(/[a-zA-Z]+/g)
        ?.join('');
    const ppc_campaign_cookies =
        Cookies.getJSON('utm_data') === 'null'
            ? {
                  utm_source: 'no source',
                  utm_medium: 'no medium',
                  utm_campaign: 'no campaign',
                  utm_content: 'no content',
              }
            : Cookies.getJSON('utm_data');

    return {
        loggedIn: !!client_information,
        account_type: account_type || 'unlogged',
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
        residence_country: client_information?.residence || null,
    };
};

const initializeGrowthBook = async (flags, client_information) => {
    const attributes = await getGrowthBookAttributes(client_information);
    const config = {
        growthbookKey: flags.marketing_growthbook ? process.env.GROWTHBOOK_CLIENT_KEY : undefined,
        growthbookDecryptionKey: flags.marketing_growthbook ? process.env.GROWTHBOOK_DECRYPTION_KEY : undefined,
        rudderstackKey: process.env.RUDDERSTACK_KEY,
        growthbookOptions: { attributes },
    };

    await Analytics?.initialise(config);
    console.log('config', config);
};

const monitorCookieChanges = flags => {
    let previousClientInfo = !!Cookies.getJSON('client_information');
    console.log('previousClientInfo', previousClientInfo);
    setInterval(async () => {
        const currentClientInfo = !!Cookies.getJSON('client_information');
        console.log('currentClientInfo', currentClientInfo);
        if (JSON.stringify(previousClientInfo) !== JSON.stringify(currentClientInfo)) {
            previousClientInfo = currentClientInfo;
            await initializeGrowthBook(flags, currentClientInfo);
        }
    }, 1000); // Check every second for changes
};

export const AnalyticsInitializer = async () => {
    const flags = await fetch(process.env.REMOTE_CONFIG_URL)
        .then(res => res.json())
        .catch(() => FIREBASE_INIT_DATA);

    if (process.env.RUDDERSTACK_KEY && flags?.tracking_rudderstack) {
        const initialClientInfo = !!Cookies.getJSON('client_information');

        monitorCookieChanges(flags); // Monitor and reinitialize on changes
        await initializeGrowthBook(flags, initialClientInfo); // Initial setup
        console.log('previousClientInfo', previousClientInfo);
    }
};
