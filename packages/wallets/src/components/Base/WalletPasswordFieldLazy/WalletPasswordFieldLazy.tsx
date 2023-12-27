import React, { lazy, Suspense } from 'react';
import { WalletTextFieldProps } from '../WalletTextField/WalletTextField';
import Loader from '../../Loader/Loader';

export interface WalletPasswordFieldProps extends WalletTextFieldProps {
    password: string;
    passwordError?: boolean;
    shouldDisablePasswordMeter?: boolean;
}

const WalletPasswordFieldLazyContainer = lazy(
    () => import('../WalletPasswordField/WalletPasswordField')
) as React.FC<WalletPasswordFieldProps>;

const WalletPasswordFieldLazy: React.FC<WalletPasswordFieldProps> = props => (
    <Suspense fallback={<Loader isFullScreen={false} />}>
        <WalletPasswordFieldLazyContainer {...props} />
    </Suspense>
);

export default WalletPasswordFieldLazy;
