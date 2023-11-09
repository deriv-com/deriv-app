import React, { useMemo, useState } from 'react';
import { zxcvbn } from '@zxcvbn-ts/core';
import { WalletTextField } from '../WalletTextField';
import { WalletTextFieldProps } from '../WalletTextField/WalletTextField';
import PasswordMeter, { PasswordMeterProps } from './PasswordMeter';
import PasswordViewerIcon from './PasswordViewerIcon';
import { StrengthMessages } from './ValidationMessages';
import './WalletPasswordField.scss';

interface WalletPasswordFieldProps extends WalletTextFieldProps, PasswordMeterProps {
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    password?: string;
    showPasswordMeter?: boolean;
}

const WalletPasswordField: React.FC<WalletPasswordFieldProps> = ({
    password = '',
    showPasswordMeter = true,
    ...rest
}) => {
    const [viewPassword, setViewPassword] = useState(false);

    const passwordStrength = zxcvbn(password).score;
    const progressText = useMemo(() => {
        return StrengthMessages[passwordStrength] ?? '';
    }, [passwordStrength]);

    return (
        <div className='wallets-password'>
            <WalletTextField
                helperMessage={progressText}
                renderRightIcon={() => (
                    <PasswordViewerIcon setViewPassword={setViewPassword} viewPassword={viewPassword} />
                )}
                showMessage
                type={viewPassword ? 'text' : 'password'}
                value={password}
                {...rest}
            />
            {showPasswordMeter && <PasswordMeter strength={passwordStrength} />}
        </div>
    );
};

export default WalletPasswordField;
