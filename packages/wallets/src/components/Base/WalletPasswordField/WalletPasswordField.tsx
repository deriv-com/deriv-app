import React, { useState } from 'react';
import { zxcvbn } from '@zxcvbn-ts/core';
import { WalletTextField } from '../WalletTextField';
import './WalletPasswordField.scss';

const WalletPasswordField = ({ label = 'Password' }) => {
    const [password, setPassword] = useState<string>('');

    const getPasswordStrength = () => {
        const result = zxcvbn(password);
        return result.score;
    };

    const getProgressColor = () => {
        const strengthColors = [
            'wallets-password__meter--initial',
            'wallets-password__meter--weak',
            'wallets-password__meter--moderate',
            'wallets-password__meter--strong',
            'wallets-password__meter--complete',
        ];

        const strength = getPasswordStrength();
        return strengthColors[strength];
    };

    return (
        <div className='wallets-password'>
            <WalletTextField label={label} onChange={e => setPassword(e.target.value)} type='password' />
            <div className='wallets-password__meter'>
                <div className={getProgressColor()} />
            </div>
        </div>
    );
};

export default WalletPasswordField;
