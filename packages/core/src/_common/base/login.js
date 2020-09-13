const isMobile = require('@deriv/shared').isMobileOs;
const getAppId = require('@deriv/shared').getAppId;
const getDerivComLink = require('@deriv/shared').getDerivComLink;
const urlForCurrentDomain = require('@deriv/shared').urlForCurrentDomain;
const { getLanguage } = require('@deriv/translations');
const Client = require('./client_base');
const isStorageSupported = require('@deriv/shared').isStorageSupported;

const Login = (() => {
    const redirectToLogin = () => {
        if (!Client.isLoggedIn() && !isLoginPages() && isStorageSupported(sessionStorage)) {
            sessionStorage.setItem('redirect_url', window.location.href);
            window.location.href = loginUrl({
                language: getLanguage(),
            });
        }
    };

    const redirectToSignUp = () => {
        window.open(getDerivComLink('/signup/'));
    };

    // TODO: update this to handle logging into /app/ url
    const isLoginPages = () => /logged_inws|redirect/i.test(window.location.pathname);

    return {
        redirectToLogin,
        isLoginPages,
        redirectToSignUp,
    };
})();

module.exports = Login;
