import { Analytics } from '@deriv-com/analytics';
import Cookies from 'js-cookie';
import { getLanguage } from '@deriv/translations';
import { LocalStore, getAppId } from '@deriv/shared';
import { MAX_MOBILE_WIDTH } from '../../Constants';
import FIREBASE_INIT_DATA from '../../../../api/src/remote_config.json';

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

            /*
                Temp solution to fetch country and handle experiments without causing inconsistencies to the users. 
            */

            const getCountry = async () => {
                try {
                    const response = await fetch('https://www.cloudflare.com/cdn-cgi/trace').catch(() => null);
                    const text = response ? await response.text().catch(() => '') : '';
                    const entries = text ? text.split('\n').map(v => v.split('=', 2)) : [];
                    const data = entries.length ? Object.fromEntries(entries) : {};
                    return data?.loc?.toLowerCase() ?? '';
                } catch {
                    return '';
                }
            };

            const config = {
                growthbookKey: flags.marketing_growthbook ? process.env.GROWTHBOOK_CLIENT_KEY : undefined,
                growthbookDecryptionKey: flags.marketing_growthbook ? process.env.GROWTHBOOK_DECRYPTION_KEY : undefined,
                rudderstackKey: process.env.RUDDERSTACK_KEY,
                growthbookOptions: {
                    attributes: {
                        account_type: account_type === 'null' ? 'unlogged' : account_type,
                        app_id: String(getAppId()),
                        device_type: window.innerWidth <= MAX_MOBILE_WIDTH ? 'mobile' : 'desktop',
                        device_language: navigator?.language || 'en-EN',
                        user_language: getLanguage().toLowerCase(),
                        country: await getCountry(),
                        utm_source: ppc_campaign_cookies?.utm_source,
                        utm_medium: ppc_campaign_cookies?.utm_medium,
                        utm_campaign: ppc_campaign_cookies?.utm_campaign,
                        utm_content: ppc_campaign_cookies?.utm_content,
                        domain: window.location.hostname,
                        url: window.location.href,
                    },
                },
            };
            await Analytics?.initialise(config);
        }
    }
};
