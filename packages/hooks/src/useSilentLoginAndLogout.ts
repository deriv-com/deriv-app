import { useEffect } from 'react';
import { requestOidcAuthentication, requestOidcSilentAuthentication } from '@deriv-com/auth-client';
import { isSafari, isSafariBrowser } from '@deriv/shared';

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
}: {
    is_client_store_initialized: boolean;
    isOAuth2Enabled: boolean;
}) => {
    useEffect(() => {
        if (isSafari() || isSafariBrowser()) return;

        const clientAccounts = JSON.parse(localStorage.getItem('client.accounts') || '{}');
        const isClientAccountsPopulated = Object.keys(clientAccounts).length > 0;
        const isSilentLoginExcluded = ['callback', 'silent-callback', 'front-channel', 'endpoint'].some(path =>
            window.location.pathname.includes(path)
        );

        // NOTE: Remove this logic once social signup is intergated with OIDC
        const params = new URLSearchParams(window.location.search);
        const isUsingLegacyFlow = params.has('token1') && params.has('acct1');
        if (isUsingLegacyFlow && isOAuth2Enabled) {
            return;
        }

        if (
            isOAuth2Enabled &&
            !isUsingLegacyFlow &&
            !isClientAccountsPopulated &&
            !isSilentLoginExcluded &&
            is_client_store_initialized
        ) {
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
    }, [isOAuth2Enabled, is_client_store_initialized]);
};

export default useSilentLoginAndLogout;
