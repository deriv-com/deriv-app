import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';

import { useStore } from '@deriv/stores';
import { redirectToLogin } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
/**
 * Handles silent login and single logout logic for OAuth2.
 *
 * @param {{
 *   is_client_store_initialized: boolean; // Whether the client store has been initialized
 *   isOAuth2Enabled: boolean; // Whether OAuth2 feature is enabled
 *   oAuthLogout: () => Promise<void>; // Function to handle OAuth2 logout
 * }} params - The arguments required for silent login and logout management
 */
const useSilentLoginAndLogout = () => {
    const loggedState = Cookies.get('logged_state');
    const [is_single_logging_in, setIsSingleLoggingIn] = useState(false);

    const { client } = useStore();
    const clientAccounts = JSON.parse(localStorage.getItem('client.accounts') || '{}');
    const clientTokens = JSON.parse(localStorage.getItem('config.tokens') || '{}');
    const isClientAccountsPopulated = Object.keys(clientAccounts).length > 0;
    const isClientTokensPopulated = Object.keys(clientTokens).length > 0;
    const isSilentLoginExcluded =
        window.location.pathname.includes('callback') || window.location.pathname.includes('endpoint');

    // state to manage and ensure OIDC callback functions are invoked once only
    const isAuthenticating = useRef(false);
    const isLoggingOut = useRef(false);
    const { is_client_store_initialized, prevent_single_login, logout } = client;

    useEffect(() => {
        const willEventuallySSO = loggedState === 'true' && !isClientAccountsPopulated && !isClientTokensPopulated;
        if (willEventuallySSO && !isSilentLoginExcluded) {
            setIsSingleLoggingIn(true);
        } else {
            setIsSingleLoggingIn(false);
        }
    }, [isClientAccountsPopulated, isClientTokensPopulated, loggedState]);

    useEffect(() => {
        if (prevent_single_login || !is_client_store_initialized || isSilentLoginExcluded) return;
        // NOTE: Remove this logic once social signup is intergated with OIDC
        const params = new URLSearchParams(window.location.search);
        const isUsingLegacyFlow = params.has('token1') && params.has('acct1');
        if (isUsingLegacyFlow && loggedState === 'false') {
            return;
        }

        if (!isUsingLegacyFlow && loggedState === 'true' && !isClientAccountsPopulated) {
            // Perform silent login
            if (isAuthenticating.current) return;
            isAuthenticating.current = true;
            redirectToLogin(false, getLanguage());
        }

        if (!isUsingLegacyFlow && loggedState === 'false' && isClientAccountsPopulated) {
            // Perform single logout
            if (isLoggingOut.current) return;
            isLoggingOut.current = true;
            logout();
        }
    }, [
        loggedState,
        isClientAccountsPopulated,
        is_client_store_initialized,
        isSilentLoginExcluded,
        prevent_single_login,
    ]);

    return { is_single_logging_in };
};

export default useSilentLoginAndLogout;
