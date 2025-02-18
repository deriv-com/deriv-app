import { useEffect } from 'react';
import Cookies from 'js-cookie';

import { requestOidcAuthentication } from '@deriv-com/auth-client';
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

/**
 * Handles silent login and single logout logic for OAuth2.
 *
 * @param {{
 *   is_client_store_initialized: boolean; // Whether the client store has been initialized
 *   isOAuth2Enabled: boolean; // Whether OAuth2 feature is enabled
 *   oAuthLogout: () => Promise<void>; // Function to handle OAuth2 logout
 * }} params - The arguments required for silent login and logout management
 */
const useSilentLoginAndLogout = ({
    is_client_store_initialized,
    isOAuth2Enabled,
    oAuthLogout,
}: {
    is_client_store_initialized: boolean;
    isOAuth2Enabled: boolean;
    oAuthLogout: () => Promise<void>;
}) => {
    const loggedState = Cookies.get('logged_state');

    const clientAccounts = JSON.parse(localStorage.getItem('client.accounts') || '{}');
    const isClientAccountsPopulated = Object.keys(clientAccounts).length > 0;
    const isSilentLoginExcluded =
        window.location.pathname.includes('callback') ||
        window.location.pathname.includes('silent-callback') ||
        window.location.pathname.includes('endpoint');

    useEffect(() => {
        window.addEventListener(
            'message',
            message => {
                if (message.data?.event === 'login_required') {
                    console.log('OIDC: prompt none says we are logged out');
                    if (isClientAccountsPopulated) {
                        oAuthLogout();
                    }
                } else if (message.data?.event === 'sso_required') {
                    console.log('OIDC: we need to SSO NOW');
                    // requestOidcAuthentication({
                    //     redirectCallbackUri: `${window.location.origin}/callback`,
                    // });
                }
            },
            false
        );
        // NOTE: Remove this logic once social signup is intergated with OIDC
        const params = new URLSearchParams(window.location.search);
        const isUsingLegacyFlow = params.has('token1') && params.has('acct1');
        if (isUsingLegacyFlow && loggedState === 'false' && isOAuth2Enabled) {
            return;
        }

        if (isOAuth2Enabled && !isUsingLegacyFlow && !isClientAccountsPopulated && !isSilentLoginExcluded) {
            console.log('OIDC: checking if we need SSO...');
            const userManager = new UserManager({
                authority: 'https://qa20.deriv.dev',
                client_id: '1000005',
                redirect_uri: 'https://localhost:8443/callback',
                silent_redirect_uri: 'https://localhost:8443/silent-callback',
                response_type: 'code',
                scope: 'openid',
                stateStore: new WebStorageStateStore({ store: window.localStorage }),
                // this is enabled by default, it runs a silent renew service in the background which triggers the prompt=none auth calls
                // Source: https://github.com/authts/oidc-client-ts/blob/9ccae8f87b3e9e2df349aaf6f007964ced287b02/src/UserManagerSettings.ts#L140
                // Notable issue: https://github.com/authts/oidc-client-ts/issues/1174
                automaticSilentRenew: false,
            });
            userManager.signinSilent({
                extraQueryParams: {
                    brand: 'deriv',
                },
                silentRequestTimeoutInSeconds: 60000,
            });
        }
    }, [isOAuth2Enabled]);
};

export default useSilentLoginAndLogout;
