import { useEffect } from 'react';
import Cookies from 'js-cookie';

import { requestOidcAuthentication } from '@deriv-com/auth-client';

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
        window.location.pathname.includes('callback') || window.location.pathname.includes('endpoint');

    useEffect(() => {
        if (
            loggedState === 'true' &&
            !isClientAccountsPopulated &&
            isOAuth2Enabled &&
            is_client_store_initialized &&
            !isSilentLoginExcluded
        ) {
            // Perform silent login
            requestOidcAuthentication({
                redirectCallbackUri: `${window.location.origin}/callback`,
            });
        }

        if (
            loggedState === 'false' &&
            is_client_store_initialized &&
            isOAuth2Enabled &&
            isClientAccountsPopulated &&
            !window.location.pathname.includes('callback')
        ) {
            // Perform single logout
            oAuthLogout();
        }
    }, [
        loggedState,
        isClientAccountsPopulated,
        is_client_store_initialized,
        isOAuth2Enabled,
        oAuthLogout,
        isSilentLoginExcluded,
    ]);
};

export default useSilentLoginAndLogout;
