import React, { ComponentProps } from 'react';
import { AuthProvider } from '@deriv/api-v2';

const WALLETS_LOGINID_LOCALSTORAGE_KEY = 'active_wallet_loginid';

const WalletsAuthProvider = ({ children, ...rest }: Omit<ComponentProps<typeof AuthProvider>, 'loginIDKey'>) => (
    <AuthProvider
        {...rest}
        loginIDKey={WALLETS_LOGINID_LOCALSTORAGE_KEY}
        selectDefaultAccount={(accountsObject: any) => {
            const loginIds = Object.keys(accountsObject);
            return loginIds.filter((loginId: string) => {
                const { account_category, account_type, currency } = accountsObject[loginId];
                const isWallet = account_category == 'wallet';
                const isVirtual = account_type == 'virtual';
                const isUsd = currency == 'USD';
                return isWallet && !isVirtual && isUsd;
            })[0];
        }}
    >
        {children}
    </AuthProvider>
);

export default WalletsAuthProvider;
