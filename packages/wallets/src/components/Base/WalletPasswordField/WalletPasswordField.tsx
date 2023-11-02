import React, { FC, useMemo, useState } from 'react';
import { zxcvbn } from '@zxcvbn-ts/core';
import { WalletTextField } from '../WalletTextField';
import './WalletPasswordField.scss';

type StrengthMessage = Record<1 | 2 | 3 | 4, string>;

interface WalletPasswordFieldProps {
    label?: string;
    maxLength?: number;
    messageObj?: StrengthMessage;
}

const WalletPasswordField: FC<WalletPasswordFieldProps> = ({ label = 'Password', maxLength, messageObj }) => {
    const [password, setPassword] = useState<string>('');
    const hasMessage = !!messageObj;
    const hasMaxLength = !!maxLength;

    const passwordStrength = zxcvbn(password).score;

    const strengthColors = [
        'wallets-password__meter--initial',
        'wallets-password__meter--weak',
        'wallets-password__meter--moderate',
        'wallets-password__meter--strong',
        'wallets-password__meter--complete',
    ];

    const progressText = useMemo(
        () => (messageObj ? messageObj[passwordStrength as keyof StrengthMessage] : ''),
        [messageObj, passwordStrength]
    );

    return (
        <div className='wallets-password'>
            <WalletTextField
                helperMessage={progressText}
                label={label}
                maxLength={maxLength}
                onChange={e => setPassword(e.target.value)}
                showMessage={hasMessage || hasMaxLength}
                type='password'
            />
            <div className='wallets-password__meter'>
                <div className={strengthColors[passwordStrength]} />
            </div>
        </div>
    );
};

export default WalletPasswordField;
