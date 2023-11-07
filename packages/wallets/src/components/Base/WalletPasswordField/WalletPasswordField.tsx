import React, { FC } from 'react';
import { WalletTextField } from '../WalletTextField';
import { WalletTextFieldProps } from '../WalletTextField/WalletTextField';
import './WalletPasswordField.scss';

type WalletPasswordFieldProps = WalletTextFieldProps;

const WalletPasswordField: FC<WalletPasswordFieldProps> = () => {
    const strengthColors = {
        0: 'wallets-password__meter--initial',
        1: 'wallets-password__meter--weak',
        2: 'wallets-password__meter--moderate',
        3: 'wallets-password__meter--strong',
        4: 'wallets-password__meter--complete',
    };

    return (
        <div className='wallets-password'>
            <WalletTextField type='password' />
            <div className='wallets-password__meter'>
                <div className={strengthColors[0]} />
            </div>
        </div>
    );
};

export default WalletPasswordField;
