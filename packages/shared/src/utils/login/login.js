import { website_name } from '../config/app-config';
import { CookieStorage, isStorageSupported, LocalStore } from '../storage/storage';
import { getAppId, domain_app_ids } from '../config/config';
import { getStaticUrl, urlForCurrentDomain } from '../url';

export const redirectToLogin = (is_logged_in, language, has_params = true) => {
    if (!is_logged_in && isStorageSupported(sessionStorage)) {
        const l = window.location;
        const redirect_url = has_params ? window.location.href : `${l.protocol}//${l.host}${l.pathname}`;
        sessionStorage.setItem('redirect_url', redirect_url);
        window.location.href = loginUrl({
            language,
        });
    }
};

export const redirectToSignUp = ({ is_dashboard }) => {
    window.open(getStaticUrl('/signup/', { is_dashboard }));
};

export const loginUrl = ({ language }) => {
    const server_url = LocalStore.get('config.server_url');
    const signup_device_cookie = new CookieStorage('signup_device');
    const signup_device = signup_device_cookie.get('signup_device');
    const date_first_contact_cookie = new CookieStorage('date_first_contact');
    const date_first_contact = date_first_contact_cookie.get('date_first_contact');
    const marketing_queries = `${signup_device ? `&signup_device=${signup_device}` : ''}${
        date_first_contact ? `&date_first_contact=${date_first_contact}` : ''
    }`;
    const getOAuthUrl = domain => {
        return `https://oauth.${domain}/oauth2/authorize?app_id=${getAppId()}&l=${language}${marketing_queries}&brand=${website_name.toLowerCase()}`;
    };

    if (server_url && /qa/.test(server_url)) {
        return `https://${server_url}/oauth2/authorize?app_id=${getAppId()}&l=${language}${marketing_queries}&brand=${website_name.toLowerCase()}`;
    }

    if (getAppId() === domain_app_ids['app.deriv.com'] && /^app\.deriv\.com$/.test(window.location.hostname)) {
        return getOAuthUrl('deriv.com');
    }
    return urlForCurrentDomain(getOAuthUrl('deriv.com'));
};
