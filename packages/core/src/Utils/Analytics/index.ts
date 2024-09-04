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
                        country:
                            Cookies.getJSON('clients_country') || Cookies?.getJSON('website_status')?.clients_country,
                        utm_source: ppc_campaign_cookies?.utm_source,
                        utm_medium: ppc_campaign_cookies?.utm_medium,
                        utm_campaign: ppc_campaign_cookies?.utm_campaign,
                        utm_content: ppc_campaign_cookies?.utm_content,
                        domain: window.location.hostname,
                    },
                },
            };
            await Analytics?.initialise(config);
        }
    }
};
