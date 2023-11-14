import React, { useState } from 'react';
import { zxcvbn } from '@zxcvbn-ts/core';
import { Score } from '@zxcvbn-ts/core/dist/types';
import { WalletTextField } from '../WalletTextField';
import { WalletTextFieldProps } from '../WalletTextField/WalletTextField';
import PasswordMeter, { PasswordMeterProps } from './PasswordMeter';
import PasswordViewerIcon from './PasswordViewerIcon';
import './WalletPasswordField.scss';

interface WalletPasswordFieldProps extends WalletTextFieldProps, PasswordMeterProps {
    password: string;
    shouldDisablePasswordMeter?: boolean;
}

const WalletPasswordField: React.FC<WalletPasswordFieldProps> = ({
    password,
    shouldDisablePasswordMeter = false,
    ...rest
}) => {
    const [viewPassword, setViewPassword] = useState(false);

    const passwordScore = password ? zxcvbn(password).score : undefined;
    const helperMessage: Partial<Record<Score, string>> = {
        0: 'You should enter 8 - 25 characters',
        1: 'Password should have lower and uppercase English letters with numbers.',
        2: 'This is a very common password',
    };

    return (
        <div className='wallets-password'>
            <WalletTextField
                helperMessage={helperMessage[passwordScore ?? 0]}
                pattern='^(?=.*[a-z])(?=.*\d)(?=.*[A-Z])[!-~]{8,25}'
                renderRightIcon={() => (
                    <PasswordViewerIcon setViewPassword={setViewPassword} viewPassword={viewPassword} />
                )}
                showMessage
                type={viewPassword ? 'text' : 'password'}
                value={password}
                {...rest}
            />
            {shouldDisablePasswordMeter && <PasswordMeter score={passwordScore} />}
        </div>
    );
};

export default WalletPasswordField;
