import React, { lazy, Suspense } from 'react';
import { TPlatforms } from '../../../types';
import Loader from '../../Loader/Loader';
import { WalletTextFieldProps } from '../WalletTextField/WalletTextField';

export interface WalletPasswordFieldProps extends WalletTextFieldProps {
    password: string;
    passwordError?: boolean;
    platform: TPlatforms.All;
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
