import React, { FC, useState } from 'react';
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

    const getPasswordStrength = () => {
        const result = zxcvbn(password);
        return result.score;
    };

    const strength = getPasswordStrength();

    const getProgressColor = () => {
        const strengthColors = [
            'wallets-password__meter--initial',
            'wallets-password__meter--weak',
            'wallets-password__meter--moderate',
            'wallets-password__meter--strong',
            'wallets-password__meter--complete',
        ];

        return strengthColors[strength];
    };

    const getProgressText = (messageObj: StrengthMessage) => {
        if (!messageObj) return '';
        return messageObj[strength as keyof StrengthMessage];
    };

    return (
        <div className='wallets-password'>
            <WalletTextField
                helperMessage={getProgressText(messageObj as StrengthMessage)}
                label={label}
                maxLength={maxLength}
                onChange={e => setPassword(e.target.value)}
                showMessage={hasMessage || hasMaxLength}
                type='password'
            />
            <div className='wallets-password__meter'>
                <div className={getProgressColor()} />
            </div>
        </div>
    );
};

export default WalletPasswordField;
