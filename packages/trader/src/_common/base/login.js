const getStaticUrl = require('@deriv/shared').getStaticUrl;
const loginUrl = require('@deriv/shared').loginUrl;
const isStorageSupported = require('@deriv/shared').isStorageSupported;
const { getLanguage } = require('@deriv/translations');

const Login = (() => {
    const redirectToLogin = is_logged_in => {
        // TODO: [add-client-action] - integrate this into Client store
        if (!is_logged_in && !isLoginPages() && isStorageSupported(sessionStorage)) {
            sessionStorage.setItem('redirect_url', window.location.href);
            window.location.href = loginUrl({
                language: getLanguage(),
            });
        }
    };

    const redirectToSignUp = ({ is_deriv_crypto }) => {
        window.open(getStaticUrl('/signup/', { is_deriv_crypto }));
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
