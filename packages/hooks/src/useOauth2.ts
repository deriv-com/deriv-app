import { redirectToLogin } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import {
    OAuth2Logout,
    requestOidcAuthentication,
    TOAuth2EnabledAppList,
    useIsOAuth2Enabled,
} from '@deriv-com/auth-client';

import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';

/**
 * Provides an object with two properties: `isOAuth2Enabled` and `oAuthLogout`.
 *
 * `isOAuth2Enabled` is a boolean that indicates whether OAuth2 is enabled.
 *
 * `oAuthLogout` is a function that logs out the user of the OAuth2-enabled app.
 *
 * The `handleLogout` argument is an optional function that will be called after logging out the user.
 * If `handleLogout` is not provided, the function will resolve immediately.
 *
 * @param {{ handleLogout?: () => Promise<void> }} [options] - An object with an optional `handleLogout` property.
 * @returns {{ isOAuth2Enabled: boolean; oAuthLogout: () => Promise<void> }}
 */
const useOauth2 = ({ handleLogout }: { handleLogout: () => Promise<void> }) => {
    const [oAuth2EnabledApps, OAuth2EnabledAppsInitialised] = useGrowthbookGetFeatureValue<string>({
        featureFlag: 'hydra_be',
    }) as unknown as [TOAuth2EnabledAppList, boolean];

    const isOAuth2Enabled = useIsOAuth2Enabled(oAuth2EnabledApps, OAuth2EnabledAppsInitialised);

    const loginHandler = async () => {
        if (isOAuth2Enabled) {
            await requestOidcAuthentication({
                redirectCallbackUri: `${window.location.origin}/callback`,
            });
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

    return { isOAuth2Enabled: true, oAuthLogout: logoutHandler, loginHandler };
};

export default useOauth2;
