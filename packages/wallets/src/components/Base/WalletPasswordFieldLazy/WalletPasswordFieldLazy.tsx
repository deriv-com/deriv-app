import React, { lazy, Suspense } from 'react';
import { WalletLoader } from '../WalletLoader';
import { WalletTextFieldProps } from '../WalletTextField/WalletTextField';

export interface WalletPasswordFieldProps extends WalletTextFieldProps {
    hideWarning?: boolean;
    mt5Policy?: boolean; // This prop is used to utilize the new password validation for MT5.
    password: string;
    passwordError?: boolean;
    serverErrorMessage?: string;
    shouldDisablePasswordMeter?: boolean;
}

const WalletPasswordFieldLazyContainer = lazy(
    () => import('../WalletPasswordField/WalletPasswordField')
) as React.FC<WalletPasswordFieldProps>;

const WalletPasswordFieldLazy: React.FC<WalletPasswordFieldProps> = props => (
    <Suspense fallback={<WalletLoader isFullScreen={false} />}>
        <WalletPasswordFieldLazyContainer {...props} />
    </Suspense>
);

export default WalletPasswordFieldLazy;
