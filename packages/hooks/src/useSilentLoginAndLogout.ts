import { useEffect } from 'react';
import { requestOidcAuthentication, requestOidcSilentAuthentication } from '@deriv-com/auth-client';

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
    const clientAccounts = JSON.parse(
        localStorage.getItem('client.accounts') || localStorage.getItem('config.tokens') || '{}'
    );
    const isClientAccountsPopulated = Object.keys(clientAccounts).length > 0;
    const isSilentLoginExcluded =
        window.location.pathname.includes('callback') ||
        window.location.pathname.includes('silent-callback') ||
        window.location.pathname.includes('front-channel') ||
        window.location.pathname.includes('endpoint');

    useEffect(() => {
        // NOTE: Remove this logic once social signup is intergated with OIDC
        const params = new URLSearchParams(window.location.search);
        const isUsingLegacyFlow = params.has('token1') && params.has('acct1');
        if (isUsingLegacyFlow && isOAuth2Enabled) {
            return;
        }

        if (isOAuth2Enabled && !isUsingLegacyFlow && !isClientAccountsPopulated && !isSilentLoginExcluded) {
            window.addEventListener(
                'message',
                message => {
                    if (message.data?.event === 'login_successful') {
                        requestOidcAuthentication({
                            redirectCallbackUri: `${window.location.origin}/callback`,
                        });
                    }
                },
                false
            );

            requestOidcSilentAuthentication({
                redirectSilentCallbackUri: `${window.location.origin}/silent-callback.html`,
                redirectCallbackUri: `${window.location.origin}/callback`,
            });
        }
    }, [isOAuth2Enabled]);
};

export default useSilentLoginAndLogout;
