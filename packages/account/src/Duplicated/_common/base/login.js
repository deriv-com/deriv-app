const { getLanguage } = require('@deriv/translations');
const getDerivComLink = require('@deriv/shared').getDerivComLink;
const isStorageSupported = require('@deriv/shared').isStorageSupported;
const loginUrl = require('@deriv/shared').loginUrl;

const Login = (() => {
    const redirectToLogin = (is_logged_in) => {
        // TODO: [add-client-action] - integrate this into Client store
        if (!is_logged_in && !isLoginPages() && isStorageSupported(sessionStorage)) {
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
