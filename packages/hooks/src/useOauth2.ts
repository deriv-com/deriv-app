import { useIsOAuth2Enabled, TOAuth2EnabledAppList, useOAuth2 } from '@deriv-com/auth-client';
import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';
import { useStore } from '@deriv/stores';
import { useHistory } from 'react-router-dom';
import { routes } from '@deriv/shared';

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
const useOauth2 = () => {
    const history = useHistory();
    const { client } = useStore();
    const { logout: logoutClient } = client;
    const [oAuth2EnabledApps, OAuth2EnabledAppsInitialised] = useGrowthbookGetFeatureValue<TOAuth2EnabledAppList>({
        featureFlag: 'hydra_be',
    });

    const isOAuth2Enabled = useIsOAuth2Enabled(oAuth2EnabledApps, OAuth2EnabledAppsInitialised);

    const oAuthGrowthbookConfig = {
        OAuth2EnabledApps: oAuth2EnabledApps,
        OAuth2EnabledAppsInitialised,
    };

    const logoutHandler = async () => {
        // for DBot we need to logout first and only after this redirect to TH
        if (window.location.pathname.startsWith(routes.bot)) {
            await logoutClient();
            history.push(routes.traders_hub);
        } else {
            history.push(routes.traders_hub);
            await logoutClient();
        }
    };

    const { OAuth2Logout: oAuthLogout } = useOAuth2(oAuthGrowthbookConfig, logoutHandler);
    return { isOAuth2Enabled, oAuthLogout };
};

export default useOauth2;
