// const Cookies = require('js-cookie');
import { isBot } from '../platform';

const DERIV_CRYPTO_STAGING_APP_ID = 2586;
const DERIV_CRYPTO_STAGING_DBOT_APP_ID = 16929;
const DERIV_CRYPTO_APP_ID = 1411;

/*
 * Configuration values needed in js codes
 *
 * NOTE:
 * Please use the following command to avoid accidentally committing personal changes
 * git update-index --assume-unchanged packages/shared/src/utils/config.js
 *
 */
export const domain_app_ids = {
    // these domains as supported "production domains"
    'deriv.app': 16929, // TODO: [app-link-refactor] - Remove backwards compatibility for `deriv.app`
    'app.deriv.com': 16929,
    'app.derivcrypto.com': DERIV_CRYPTO_APP_ID,
    'binary.com': 1,
};

const binary_desktop_app_id = 14473;

export const getCurrentProductionDomain = () =>
    !/^staging\./.test(window.location.hostname) &&
    Object.keys(domain_app_ids).find(domain => new RegExp(`.${domain}$`, 'i').test(window.location.hostname));

export const isProduction = () => {
    const all_domains = Object.keys(domain_app_ids).map(domain => `(www\\.)?${domain.replace('.', '\\.')}`);
    return new RegExp(`^(${all_domains.join('|')})$`, 'i').test(window.location.hostname);
};

export const getAppId = () => {
    let app_id = null;
    const user_app_id = ''; // you can insert Application ID of your registered application here
    const config_app_id = window.localStorage.getItem('config.app_id');
    const is_crypto_app = window.localStorage.getItem('is_deriv_crypto_app') === 'true';

    if (config_app_id) {
        app_id = config_app_id;
    } else if (/desktop-app/i.test(window.location.href) || window.localStorage.getItem('config.is_desktop_app')) {
        window.localStorage.removeItem('config.default_app_id');
        window.localStorage.setItem('config.is_desktop_app', 1);
        app_id = binary_desktop_app_id;
    } else if (user_app_id.length) {
        window.localStorage.setItem('config.default_app_id', user_app_id);
        app_id = user_app_id;
    } else if (
        /staging\.deriv\.app/i.test(window.location.hostname) || // TODO: [app-link-refactor] - Remove backwards compatibility for `deriv.app`
        /staging-app\.deriv\.com/i.test(window.location.hostname)
    ) {
        window.localStorage.removeItem('config.default_app_id');
        app_id = isBot() ? 19112 : 16303; // it's being used in endpoint chrome extension - please do not remove

        if (is_crypto_app) {
            app_id = isBot() ? DERIV_CRYPTO_STAGING_DBOT_APP_ID : DERIV_CRYPTO_STAGING_APP_ID;
        }
    } else if (/localhost/i.test(window.location.hostname)) {
        app_id = 17044;
    } else {
        window.localStorage.removeItem('config.default_app_id');
        const current_domain = getCurrentProductionDomain();
        app_id = domain_app_ids[current_domain] || (isBot() ? 19111 : 16929);
    }
    return app_id;
};

export const getSocketURL = () => {
    const local_storage_server_url = window.localStorage.getItem('config.server_url');
    if (local_storage_server_url) return local_storage_server_url;

    let active_loginid_from_url;
    const search = window.location.search;
    if (search) {
        const params = new URLSearchParams(document.location.search.substring(1));
        active_loginid_from_url = params.get('acct1');
    }

    const loginid = window.localStorage.getItem('active_loginid') || active_loginid_from_url;
    const is_real = loginid && !/^VRT/.test(loginid);

    const server = is_real ? 'green' : 'blue';
    const server_url = `${server}.binaryws.com`;

    return server_url;
};

export const checkAndSetEndpointFromUrl = () => {
    // TODO: [app-link-refactor] - Remove backwards compatibility for `deriv.app`
    if (/^(staging\.deriv\.app|staging-app\.deriv\.com|(.*)\.binary\.sx)$/i.test(location.hostname)) {
        const url_params = new URLSearchParams(location.search.slice(1));

        if (url_params.has('qa_server') && url_params.has('app_id')) {
            const qa_server = url_params.get('qa_server');
            const app_id = url_params.get('app_id');

            url_params.delete('qa_server');
            url_params.delete('app_id');

            if (/^(www\.binaryqa[0-9]{1,2}\.com|(.*)\.binaryws\.com)$/.test(qa_server) && /^[0-9]+$/.test(app_id)) {
                localStorage.setItem('config.app_id', app_id);
                localStorage.setItem('config.server_url', qa_server);
            }

            const params = url_params.toString();
            const hash = location.hash;

            location.href = `${location.protocol}//${location.hostname}${location.pathname}${
                params ? `?${params}` : ''
            }${hash || ''}`;
        }
    }
};
