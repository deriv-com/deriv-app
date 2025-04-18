import { redirectToLogin } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import { OAuth2Logout, requestOidcAuthentication } from '@deriv-com/auth-client';

/**
 * Provides an object with one properties: `oAuthLogout`.
 *
 * `oAuthLogout` is a function that logs out the user of the OAuth2-enabled app.
 *
 * The `handleLogout` argument is an optional function that will be called after logging out the user.
 * If `handleLogout` is not provided, the function will resolve immediately.
 *
 * @param {{ handleLogout?: () => Promise<void> }} [options] - An object with an optional `handleLogout` property.
 * @returns {{ oAuthLogout: () => Promise<void> }}
 */
const useOauth2 = ({ handleLogout }: { handleLogout: () => Promise<void> }) => {
    const is_deriv_com = /deriv\.(com)/.test(window.location.hostname);
    const loginHandler = async () => {
        if (is_deriv_com) {
            try {
                await requestOidcAuthentication({
                    redirectCallbackUri: `${window.location.origin}/callback`,
                    postLoginRedirectUri: window.location.href,
                }).catch(err => {
                    // eslint-disable-next-line no-console
                    console.error(err);
                });
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error(err);
            }
        }
        redirectToLogin(false, getLanguage());
    };

    const logoutHandler = async () => {
        await OAuth2Logout({
            WSLogoutAndRedirect: handleLogout,
            redirectCallbackUri: `${window.location.origin}/callback`,
            postLogoutRedirectUri: `${window.location.origin}/`,
        });
    };

    return { oAuthLogout: logoutHandler, loginHandler };
};

export default useOauth2;
