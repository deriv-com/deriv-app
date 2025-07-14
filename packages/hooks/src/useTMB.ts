import { useCallback, useMemo } from 'react';
import Cookies from 'js-cookie';

import { removeCookies } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { Chat } from '@deriv/utils';
import { requestSessionActive } from '@deriv-com/auth-client';

type UseTMBReturn = {
    handleLogout: VoidFunction;
    onRenderTMBCheck: VoidFunction;
    isTmbEnabled: () => Promise<boolean>;
};

type TMBApiReturnedValue = {
    tokens?: {
        loginid: string;
        token: string;
        cur: string;
    };
    active?: boolean;
};

/**
 * useTMB - hooks to help with TMB function such getting the active sessions and tokens
 * @returns {UseOAuthReturn}
 */
const useTMB = (options: { showErrorModal?: VoidFunction } = {}): UseTMBReturn => {
    const { showErrorModal } = options;
    const { client } = useStore();
    const { init, setIsLoggingIn, is_logged_in } = client;

    // Replace getCurrentRoute with direct pathname check
    const currentPathname = window.location.pathname;
    const isEndpointPage = currentPathname.endsWith('/endpoint') || currentPathname === '/endpoint';
    const isRedirectPage = currentPathname.endsWith('/redirect') || currentPathname === '/redirect';

    const domains = useMemo(
        () => ['deriv.com', 'deriv.dev', 'binary.sx', 'pages.dev', 'localhost', 'deriv.be', 'deriv.me'],
        []
    );
    const currentDomain = window.location.hostname.split('.').slice(-2).join('.');

    function endChat() {
        window.LC_API?.close_chat?.();
        window.LiveChatWidget?.call('hide');
        window.fcWidget?.close();
        Chat.clear();
    }

    const handleLogout = useCallback(async () => {
        if (is_logged_in) {
            removeCookies('affiliate_token', 'affiliate_tracking', 'utm_data', 'onfido_token', 'gclid');
            localStorage.removeItem('closed_toast_notifications');
            localStorage.removeItem('is_wallet_migration_modal_closed');
            localStorage.removeItem('active_wallet_loginid');
            localStorage.removeItem('config.account1');
            localStorage.removeItem('config.tokens');
            localStorage.removeItem('verification_code.system_email_change');
            localStorage.removeItem('verification_code.request_email');
            localStorage.removeItem('new_email.system_email_change');
            localStorage.removeItem('active_loginid');
            localStorage.removeItem('clientAccounts');
            Object.keys(sessionStorage)
                .filter(key => key !== 'trade_store')
                .forEach(key => sessionStorage.removeItem(key));
            endChat();
            if (domains.includes(currentDomain)) {
                Cookies.set('logged_state', 'false', {
                    domain: currentDomain,
                    expires: 30,
                    path: '/',
                    secure: true,
                });
            }
        }
        // window.open(oauthUrl, '_self');
    }, [currentDomain, domains]);

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

    const isTmbEnabled = async () => {
        const storedValue = localStorage.getItem('is_tmb_enabled');
        try {
            const url =
                process.env.NODE_ENV === 'production'
                    ? 'https://app-config-prod.firebaseio.com/remote_config/oauth/is_tmb_enabled.json'
                    : 'https://app-config-staging.firebaseio.com/remote_config/oauth/is_tmb_enabled.json';
            const response = await fetch(url);
            const result = await response.json();

            return storedValue !== null ? storedValue === 'true' : !!result.app;
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            // by default it will fallback to true if firebase error happens
            return storedValue !== null ? storedValue === 'true' : false;
        }
    };

    const onRenderTMBCheck = useCallback(async () => {
        setIsLoggingIn(true);
        const activeSessions = await getActiveSessions();
        if (!activeSessions?.active) {
            setIsLoggingIn(false);
            return handleLogout();
        }

        if (activeSessions?.active) {
            const localStorageClientAccounts = localStorage.getItem('clientAccounts');
            const activeSessionTokens = JSON.stringify(activeSessions?.tokens);
            const shouldReinitializeClientStore = localStorageClientAccounts !== activeSessionTokens;

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
                params.set('account', account ?? '');
                const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
                window.history.replaceState({}, '', newUrl);
            }

            // Handle account selection based on type (demo or real)
            if (account?.toLocaleUpperCase() === 'DEMO') {
                // For demo accounts, find virtual accounts with USD currency
                const demoAccount = activeSessions?.tokens?.find(
                    (item: TMBApiReturnedValue['tokens']) =>
                        item?.cur.toLocaleUpperCase() === 'USD' && item.loginid.startsWith('VRTC')
                );

                const demoWalletAccount = activeSessions?.tokens?.find(
                    (item: TMBApiReturnedValue['tokens']) =>
                        item?.cur.toLocaleUpperCase() === 'USD' && item.loginid.startsWith('VRW')
                );

                if (
                    !demoAccount &&
                    (sessionStorage.getItem('active_loginid') || localStorage.getItem('active_loginid'))
                ) {
                    sessionStorage.removeItem('active_loginid');
                    localStorage.removeItem('active_loginid');
                }

                if (
                    !demoWalletAccount &&
                    (sessionStorage.getItem('active_wallet_loginid') || localStorage.getItem('active_wallet_loginid'))
                ) {
                    sessionStorage.removeItem('active_wallet_loginid');
                    localStorage.removeItem('active_wallet_loginid');
                }

                setAccountInSessionStorage(demoAccount?.loginid);
                setAccountInSessionStorage(demoWalletAccount?.loginid, true);
            } else {
                // For real accounts, find accounts matching the selected currency
                const realAccount = activeSessions?.tokens?.find(
                    (item: TMBApiReturnedValue['tokens']) =>
                        item?.cur.toLocaleUpperCase() === account?.toLocaleUpperCase() &&
                        ((item?.loginid.startsWith('CR') && !item?.loginid.startsWith('CRW')) ||
                            (item?.loginid.startsWith('MF') && !item.loginid.startsWith('MFW')))
                );

                const realWalletAccount = activeSessions?.tokens?.find(
                    (item: TMBApiReturnedValue['tokens']) =>
                        item?.cur.toLocaleUpperCase() === account?.toLocaleUpperCase() &&
                        (item?.loginid.startsWith('CRW') || item?.loginid.startsWith('MFW'))
                );

                if (
                    !realAccount &&
                    (sessionStorage.getItem('active_loginid') || localStorage.getItem('active_loginid'))
                ) {
                    sessionStorage.removeItem('active_loginid');
                    localStorage.removeItem('active_loginid');
                }

                if (
                    !realWalletAccount &&
                    (sessionStorage.getItem('active_wallet_loginid') || localStorage.getItem('active_wallet_loginid'))
                ) {
                    sessionStorage.removeItem('active_wallet_loginid');
                    localStorage.removeItem('active_wallet_loginid');
                }

                setAccountInSessionStorage(realAccount?.loginid);
                setAccountInSessionStorage(realWalletAccount?.loginid, true);
            }
            const convertedResult = {};

            activeSessions.tokens.forEach((account: TMBApiReturnedValue['tokens'], index: number) => {
                const num = index + 1;
                account?.loginid && ((convertedResult as Record<string, string>)[`acct${num}`] = account.loginid);
                account?.token && ((convertedResult as Record<string, string>)[`token${num}`] = account.token);
                account?.cur && ((convertedResult as Record<string, string>)[`cur${num}`] = account.cur);
            });

            if (shouldReinitializeClientStore) {
                // Trigger init Client Store
                //@ts-expect-error ignore this as of now
                init(convertedResult);
            } else {
                setIsLoggingIn(false);
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

    return { handleLogout, onRenderTMBCheck, isTmbEnabled };
};

export default useTMB;
