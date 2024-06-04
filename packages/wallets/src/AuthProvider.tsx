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
