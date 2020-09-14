const isMobile = require('@deriv/shared').isMobileOs;
const domain_app_ids = require('@deriv/shared').domain_app_ids;
const getAppId = require('@deriv/shared').getAppId;
const getDerivComLink = require('@deriv/shared').getDerivComLink;
const urlForCurrentDomain = require('@deriv/shared').urlForCurrentDomain;
const { getLanguage } = require('@deriv/translations');
const website_name = require('@deriv/shared').website_name;
const isStorageSupported = require('../storage').isStorageSupported;
const LocalStore = require('../storage').LocalStore;

const Login = (() => {
    const redirectToLogin = is_logged_in => {
        if (!is_logged_in && !isLoginPages() && isStorageSupported(sessionStorage)) {
            sessionStorage.setItem('redirect_url', window.location.href);
            window.location.href = loginUrl();
        }
    };

    const redirectToSignUp = () => {
        window.open(getDerivComLink('/signup/'));
    };

    const loginUrl = () => {
        const server_url = localStorage.getItem('config.server_url');
        const language = getLanguage();
        const signup_device = LocalStore.get('signup_device') || (isMobile() ? 'mobile' : 'desktop');
        const date_first_contact = LocalStore.get('date_first_contact');
        const marketing_queries = `&signup_device=${signup_device}${
            date_first_contact ? `&date_first_contact=${date_first_contact}` : ''
        }`;
        // TODO: [app-link-refactor] - Remove backwards compatibility for `deriv.app`
        const default_login_url_app = `https://oauth.deriv.app/oauth2/authorize?app_id=${getAppId()}&l=${language}${marketing_queries}&brand=${website_name.toLowerCase()}`;
        const default_login_url = `https://oauth.deriv.com/oauth2/authorize?app_id=${getAppId()}&l=${language}${marketing_queries}&brand=${website_name.toLowerCase()}`;

        if (server_url && /qa/.test(server_url)) {
            return `https://${server_url}/oauth2/authorize?app_id=${getAppId()}&l=${language}${marketing_queries}&brand=${website_name.toLowerCase()}`;
        }

        // TODO: [app-link-refactor] - Remove backwards compatibility for `deriv.app`
        if (getAppId() === domain_app_ids['deriv.app'] && /^(www\.)?deriv\.app$/.test(window.location.hostname)) {
            return default_login_url_app;
        }
        if (getAppId() === domain_app_ids['app.deriv.com'] && /^app\.deriv\.com$/.test(window.location.hostname)) {
            return default_login_url;
        }
        return urlForCurrentDomain(default_login_url);
    };

    // TODO: update this to handle logging into /app/ url
    const isLoginPages = () => /logged_inws|redirect/i.test(window.location.pathname);

    return {
        redirectToLogin,
        loginUrl,
        isLoginPages,
        redirectToSignUp,
    };
})();

module.exports = Login;
