const Client              = require('./client_base');
const getLanguage         = require('../language').get;
const isMobile            = require('../os_detect').isMobile;
const isStorageSupported  = require('../storage').isStorageSupported;
const LocalStore          = require('../storage').LocalStore;
const urlForCurrentDomain = require('../url').urlForCurrentDomain;
const getAppId            = require('../../config').getAppId;

const Login = (() => {
    const redirectToLogin = () => {
        if (!Client.isLoggedIn() && !isLoginPages() && isStorageSupported(sessionStorage)) {
            sessionStorage.setItem('redirect_url', window.location.href);
            window.location.href = loginUrl();
        }
    };

    const loginUrl = () => {
        const server_url = localStorage.getItem('config.server_url');
        const language   = getLanguage();
        const signup_device      = LocalStore.get('signup_device') || (isMobile() ? 'mobile' : 'desktop');
        const date_first_contact = LocalStore.get('date_first_contact');
        const marketing_queries   = `&signup_device=${signup_device}${date_first_contact ? `&date_first_contact=${date_first_contact}` : ''}`;

        return ((server_url && /qa/.test(server_url)) ?
            `https://${server_url}/oauth2/authorize?app_id=${getAppId()}&l=${language}${marketing_queries}` :
            urlForCurrentDomain(`https://oauth.binary.com/oauth2/authorize?app_id=${getAppId()}&l=${language}${marketing_queries}`)
        );
    };

    // TODO: update this to handle logging into /app/ url
    const isLoginPages = () => /logged_inws|redirect/i.test(window.location.pathname);

    const socialLoginUrl = brand => (`${loginUrl()}&social_signup=${brand}`);

    const initOneAll = () => {
        ['google', 'facebook'].forEach(provider => {
            $(`#button_${provider}`).off('click').on('click', e => {
                e.preventDefault();
                window.location.href = socialLoginUrl(provider);
            });
        });
    };

    return {
        redirectToLogin,
        isLoginPages,
        initOneAll,
    };
})();

module.exports = Login;
