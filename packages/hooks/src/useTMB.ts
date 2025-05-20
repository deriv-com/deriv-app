import { useCallback, useMemo } from 'react';
import Cookies from 'js-cookie';

import { loginUrl, removeCookies } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import { requestSessionActive } from '@deriv-com/auth-client';

type UseTMBReturn = {
    handleLogout: VoidFunction;
    onRenderTMBCheck: VoidFunction;
};

/**
 * useTMB - hooks to help with TMB function such getting the active sessions and tokens
 * @returns {UseOAuthReturn}
 */
const useTMB = (options: { showErrorModal?: VoidFunction } = {}): UseTMBReturn => {
    const { showErrorModal } = options;

    // Replace getCurrentRoute with direct pathname check
    const currentPathname = window.location.pathname;
    const isEndpointPage = currentPathname.endsWith('/endpoint') || currentPathname === '/endpoint';
    const isRedirectPage = currentPathname.endsWith('/redirect') || currentPathname === '/redirect';
    const oauthUrl = loginUrl({
        language: getLanguage(),
    });
    const domains = useMemo(
        () => ['deriv.com', 'deriv.dev', 'binary.sx', 'pages.dev', 'localhost', 'deriv.be', 'deriv.me'],
        []
    );
    const currentDomain = window.location.hostname.split('.').slice(-2).join('.');

    const handleLogout = useCallback(async () => {
        removeCookies('affiliate_token', 'affiliate_tracking', 'utm_data', 'onfido_token', 'gclid');
        if (domains.includes(currentDomain)) {
            Cookies.set('logged_state', 'false', {
                domain: currentDomain,
                expires: 30,
                path: '/',
                secure: true,
            });
        }
        window.open(oauthUrl, '_self');
    }, [currentDomain, domains, oauthUrl]);

    // Helper function to set account in session storage
    const setAccountInSessionStorage = (loginid?: string, isWallet = false) => {
        if (!loginid) return;

        const key = isWallet ? 'active_wallet_loginid' : 'active_loginid';
        sessionStorage.setItem(key, loginid);
    };

    const getActiveSessions = useCallback(async () => {
        try {
            const data = await requestSessionActive();

            return data;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to get active sessions', error);
            showErrorModal?.();
        }
    }, [showErrorModal]);

    const onRenderTMBCheck = useCallback(async () => {
        const activeSessions = await getActiveSessions();

        if (!activeSessions?.active && !isEndpointPage) {
            return handleLogout();
        }

        if (activeSessions?.active) {
            localStorage.setItem('clientAccounts', JSON.stringify(activeSessions?.tokens));

            // Get account from URL params and set the loginid to session storage
            const params = new URLSearchParams(location.search);
            let account = params.get('account');

            // If no account in params, determine from first available account
            if (!account && activeSessions?.tokens?.length > 0) {
                const firstAccount = activeSessions.tokens[0];

                // Set account based on account type (demo or real)
                account = firstAccount.loginid.startsWith('VR') ? 'demo' : firstAccount.cur;

                // Update URL params to reflect the selected account
                params.set('account', account);
                const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
                window.history.replaceState({}, '', newUrl);
            }

            // Handle account selection based on type (demo or real)
            if (account?.toLocaleUpperCase() === 'DEMO') {
                // For demo accounts, find virtual accounts with USD currency
                const demoAccount = activeSessions?.tokens?.find(
                    item => item.cur.toLocaleUpperCase() === 'USD' && item.loginid.startsWith('VRTC')
                );

                const demoWalletAccount = activeSessions?.tokens?.find(
                    item => item.cur.toLocaleUpperCase() === 'USD' && item.loginid.startsWith('VRW')
                );

                setAccountInSessionStorage(demoAccount?.loginid);
                setAccountInSessionStorage(demoWalletAccount?.loginid, true);
            } else {
                // For real accounts, find accounts matching the selected currency
                const realAccount = activeSessions?.tokens?.find(
                    item =>
                        item.cur.toLocaleUpperCase() === account?.toLocaleUpperCase() &&
                        item.loginid.startsWith('CR') &&
                        !item.loginid.startsWith('CRW')
                );

                const realWalletAccount = activeSessions?.tokens?.find(
                    item =>
                        item.cur.toLocaleUpperCase() === account?.toLocaleUpperCase() && item.loginid.startsWith('CRW')
                );

                setAccountInSessionStorage(realAccount?.loginid);
                setAccountInSessionStorage(realWalletAccount?.loginid, true);
            }

            // TODO:
            // For backward compatibility, we need to set logged_state cookie to tell other apps about authentication state
            // Can be removed when all the apps are using TMB
            if (domains.includes(currentDomain)) {
                Cookies.set('logged_state', 'true', {
                    domain: currentDomain,
                    expires: 30,
                    path: '/',
                    secure: true,
                });
            }
        }

        if (isRedirectPage) {
            const params = new URLSearchParams(location.search);
            const from = params.get('from');
            const authTokenCookie = Cookies.get('authtoken');

            if (from === 'tradershub' && authTokenCookie) {
                const cleanedAuthToken = decodeURIComponent(authTokenCookie).replace(/^"|"$/g, '');
                localStorage.setItem('authToken', cleanedAuthToken);
                Cookies.remove('authtoken');
                window.location.href = window.location.origin;
            }
        }
    }, [getActiveSessions, isEndpointPage, handleLogout, domains, currentDomain, isRedirectPage]);

    return { handleLogout, onRenderTMBCheck };
};

export default useTMB;
