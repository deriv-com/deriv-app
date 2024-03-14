import React, { ComponentProps } from 'react';
import { AuthProvider } from '@deriv/api-v2';

const WALLETS_LOGINID_LOCALSTORAGE_KEY = 'active_wallet_loginid';

const WalletsAuthProvider = ({ children, ...rest }: Omit<ComponentProps<typeof AuthProvider>, 'loginIDKey'>) => (
    <AuthProvider {...rest} loginIDKey={WALLETS_LOGINID_LOCALSTORAGE_KEY}>
        {children}
    </AuthProvider>
);

export default WalletsAuthProvider;
