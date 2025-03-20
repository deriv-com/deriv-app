import { useEffect, useRef } from 'react';
import { requestOidcAuthentication, requestOidcSilentAuthentication } from '@deriv-com/auth-client';
import { isSafariBrowser } from '@deriv/shared';
import { useStore } from '@deriv/stores';

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
    const { client } = useStore();
    const clientAccounts = JSON.parse(localStorage.getItem('client.accounts') || '{}');
    const isClientAccountsPopulated = Object.keys(clientAccounts).length > 0;
    const isSilentLoginExcluded = ['callback', 'silent-callback', 'front-channel', 'endpoint'].some(path =>
        window.location.pathname.includes(path)
    );
    // state to manage and ensure OIDC callback functions are invoked once only
    const isAuthenticating = useRef(false);
    const isPrompting = useRef(false);
    const { prevent_single_login } = client;

    useEffect(() => {
        if (
            isSafariBrowser() ||
            prevent_single_login ||
            !isOAuth2Enabled ||
            !is_client_store_initialized ||
            isSilentLoginExcluded
        )
            return;

        // NOTE: Remove this logic once social signup is intergated with OIDC
        const params = new URLSearchParams(window.location.search);
        const isUsingLegacyFlow = params.has('token1') && params.has('acct1');
        if (isUsingLegacyFlow) {
            return;
        }

        if (!isClientAccountsPopulated) {
            window.addEventListener(
                'message',
                message => {
                    if (message.data?.event === 'login_successful') {
                        if (isAuthenticating.current) return;
                        isAuthenticating.current = true;
                        requestOidcAuthentication({
                            redirectCallbackUri: `${window.location.origin}/callback`,
                        });
                    }
                },
                false
            );

            if (isPrompting.current) return;
            isPrompting.current = true;
            requestOidcSilentAuthentication({
                redirectSilentCallbackUri: `${window.location.origin}/silent-callback.html`,
                redirectCallbackUri: `${window.location.origin}/callback`,
            });
        }
    }, [
        isClientAccountsPopulated,
        is_client_store_initialized,
        isOAuth2Enabled,
        isSilentLoginExcluded,
        prevent_single_login,
    ]);
};

export default useSilentLoginAndLogout;
