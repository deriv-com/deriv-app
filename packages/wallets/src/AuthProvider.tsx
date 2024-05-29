import React, { ComponentProps } from 'react';
import { AuthProvider } from '@deriv/api-v2';

const WALLETS_LOGINID_LOCALSTORAGE_KEY = 'active_wallet_loginid';

const WalletsAuthProvider = ({ children, ...rest }: Omit<ComponentProps<typeof AuthProvider>, 'loginIDKey'>) => (
    <AuthProvider
        {...rest}
        loginIDKey={WALLETS_LOGINID_LOCALSTORAGE_KEY}
        selectDefaultAccount={accountsObject => {
            const loginIds = Object.keys(accountsObject);
            const defaultFiatWallet = loginIds.filter((loginId: string) => {
                const { account_category: accountCategory, account_type: accountType } = accountsObject[loginId];
                const isWallet = accountCategory == 'wallet';
                const isFiat = accountType == 'doughflow';
                return isWallet && isFiat;
            })[0];

            const queryParams = new URLSearchParams(location.search);
            const loginidQueryParam = queryParams.get('loginid');

            if (loginidQueryParam) {
                const selectedWalletAccount = loginIds.filter(loginid => loginid === loginidQueryParam)[0];
                const url = new URL(window.location.href);
                url.searchParams.delete('loginid');
                window.history.replaceState({}, document.title, url.toString());

                return selectedWalletAccount;
            }

            if (!defaultFiatWallet) {
                const defaultWallet = loginIds.filter((loginId: string) => {
                    const { account_category: accountCategory } = accountsObject[loginId];
                    const isWallet = accountCategory == 'wallet';
                    return isWallet;
                })[0];
                return defaultWallet;
            }
            return defaultFiatWallet;
        }}
    >
        {children}
    </AuthProvider>
);

export default WalletsAuthProvider;
