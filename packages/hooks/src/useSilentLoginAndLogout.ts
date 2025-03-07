import { useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

import { requestOidcAuthentication } from '@deriv-com/auth-client';
import { useStore } from '@deriv/stores';
import { useDebounceCallback } from 'usehooks-ts';

const DEFAULT_DEBOUNCE_TIME = 10000;

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

    const { client } = useStore();
    const clientAccounts = JSON.parse(localStorage.getItem('client.accounts') || '{}');
    const isClientAccountsPopulated = Object.keys(clientAccounts).length > 0;
    const isSilentLoginExcluded =
        window.location.pathname.includes('callback') || window.location.pathname.includes('endpoint');

    // state to manage and ensure OIDC callback functions are invoked once
    const isAuthenticating = useRef(false);
    const isLoggingOut = useRef(false);
    const debouncedOidcAuthentication = useDebounceCallback(
        () => {
            if (isAuthenticating.current) return;
            isAuthenticating.current = true;
            requestOidcAuthentication({
                redirectCallbackUri: `${window.location.origin}/callback`,
            });
        },
        DEFAULT_DEBOUNCE_TIME,
        {
            leading: true,
        }
    );
    const debouncedOidcLogout = useDebounceCallback(
        () => {
            if (isLoggingOut.current) return;
            isLoggingOut.current = true;
            oAuthLogout();
        },
        DEFAULT_DEBOUNCE_TIME,
        {
            leading: true,
        }
    );
    const { prevent_single_login } = client;

    useEffect(() => {
        if (prevent_single_login || !isOAuth2Enabled || !is_client_store_initialized || isSilentLoginExcluded) return;
        // NOTE: Remove this logic once social signup is intergated with OIDC
        const params = new URLSearchParams(window.location.search);
        const isUsingLegacyFlow = params.has('token1') && params.has('acct1');
        if (isUsingLegacyFlow && loggedState === 'false' && isOAuth2Enabled) {
            return;
        }

        if (!isUsingLegacyFlow && loggedState === 'true' && !isClientAccountsPopulated) {
            // Perform silent login
            debouncedOidcAuthentication();
        }

        if (!isUsingLegacyFlow && loggedState === 'false' && isClientAccountsPopulated) {
            // Perform single logout
            debouncedOidcLogout();
        }
    }, [
        loggedState,
        isClientAccountsPopulated,
        is_client_store_initialized,
        isOAuth2Enabled,
        isSilentLoginExcluded,
        prevent_single_login,
    ]);
};

export default useSilentLoginAndLogout;
