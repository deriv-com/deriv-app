import { requestSessionActive } from '@deriv-com/auth-client';

// Helper function to set account in session storage
const setAccountInSessionStorage = (loginid?: string, isWallet = false) => {
    if (!loginid) return;

    const key = isWallet ? 'active_wallet_loginid' : 'active_loginid';
    sessionStorage.setItem(key, loginid);
};

const getActiveSessions = async () => {
    try {
        const data = await requestSessionActive();

        return data;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to get active sessions', error);
    }
};

const getTmbTokens = async (token?: string, isWalletToken?: boolean) => {
    const activeSessions = await getActiveSessions();

    if (!activeSessions?.active) {
        return token;
    }

    if (activeSessions?.active) {
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
                item => item?.cur.toLocaleUpperCase() === 'USD' && item.loginid.startsWith('VRTC')
            );

            const demoWalletAccount = activeSessions?.tokens?.find(
                item => item?.cur.toLocaleUpperCase() === 'USD' && item.loginid.startsWith('VRW')
            );

            if (
                !demoWalletAccount &&
                (sessionStorage.getItem('active_wallet_loginid') || localStorage.getItem('active_wallet_loginid'))
            ) {
                sessionStorage.removeItem('active_wallet_loginid');
                localStorage.removeItem('active_wallet_loginid');
            }

            // setAccountInSessionStorage(demoAccount?.loginid);
            // setAccountInSessionStorage(demoWalletAccount?.loginid, true);
            if (isWalletToken) {
                return demoWalletAccount?.token ?? demoAccount?.token;
            }
            return demoAccount?.token ?? demoWalletAccount?.token;
        }
        // For real accounts, find accounts matching the selected currency
        const realAccount = activeSessions?.tokens?.find(
            item =>
                item?.cur.toLocaleUpperCase() === account?.toLocaleUpperCase() &&
                ((item?.loginid.startsWith('CR') && !item?.loginid.startsWith('CRW')) ||
                    (item?.loginid.startsWith('MF') && !item.loginid.startsWith('MFW')))
        );

        const realWalletAccount = activeSessions?.tokens?.find(
            item =>
                item?.cur.toLocaleUpperCase() === account?.toLocaleUpperCase() &&
                (item?.loginid.startsWith('CRW') || item?.loginid.startsWith('MFW'))
        );

        if (!realAccount && (sessionStorage.getItem('active_loginid') || localStorage.getItem('active_loginid'))) {
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

        // setAccountInSessionStorage(realAccount?.loginid);
        // setAccountInSessionStorage(realWalletAccount?.loginid, true);
        if (isWalletToken) {
            return realWalletAccount?.token ?? realAccount?.token;
        }
        return realAccount?.token ?? realWalletAccount?.token;
    }
};

export default getTmbTokens;
