import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';

import { requestOidcAuthentication } from '@deriv-com/auth-client';
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
    oAuthLogout,
}: {
    is_client_store_initialized: boolean;
    isOAuth2Enabled: boolean;
    oAuthLogout: () => Promise<void>;
}) => {
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
    const { prevent_single_login, setIsSingleLoggingIn: setClientIsSingleLoggingIn } = client;

    useEffect(() => {
        const willEventuallySSO = loggedState === 'true' && !isClientAccountsPopulated && !isClientTokensPopulated;
        if (willEventuallySSO && !isSilentLoginExcluded) {
            setIsSingleLoggingIn(true);
        } else {
            setIsSingleLoggingIn(false);
        }
    }, [isClientAccountsPopulated, isClientTokensPopulated, loggedState]);

    const requestOidcLogin = async () => {
        try {
            await requestOidcAuthentication({
                redirectCallbackUri: `${window.location.origin}/callback`,
                postLoginRedirectUri: window.location.href,
            }).catch(err => {
                setClientIsSingleLoggingIn(false);
                // eslint-disable-next-line no-console
                console.error(err);
            });
        } catch (err) {
            setClientIsSingleLoggingIn(false);
            // eslint-disable-next-line no-console
            console.error(err);
        }
    };

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
            if (isAuthenticating.current) return;
            isAuthenticating.current = true;
            setClientIsSingleLoggingIn(true);
            requestOidcLogin();
        }

        if (!isUsingLegacyFlow && loggedState === 'false' && isClientAccountsPopulated) {
            // Perform single logout
            if (isLoggingOut.current) return;
            isLoggingOut.current = true;
            oAuthLogout();
        }
    }, [
        loggedState,
        isClientAccountsPopulated,
        is_client_store_initialized,
        isOAuth2Enabled,
        isSilentLoginExcluded,
        prevent_single_login,
    ]);

    return { is_single_logging_in };
};

export default useSilentLoginAndLogout;
