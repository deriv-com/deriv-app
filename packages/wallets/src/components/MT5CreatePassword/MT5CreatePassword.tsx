import React from 'react';
import MT5PasswordIcon from '../../public/images/ic-mt5-password.svg';
import PasswordShowIcon from '../../public/images/ic-password-show.svg';

const MT5CreatePassword = () => {
    return (
        <div className='wallets-create-password'>
            <MT5PasswordIcon />
            <div className='wallets-create-password-title'>Create a Deriv MT5 password</div>
            <span className='wallets-create-password-subtitle'>
                You can use this password for all your Deriv MT5 accounts.
            </span>
            <div className='wallets-create-password-input'>
                <input placeholder='Deriv MT5 password' type='password' />
                <PasswordShowIcon className='wallets-create-password-input-trailing-icon' />
            </div>
            <button className='wallets-create-password-button'>Create Deriv MT5 password</button>
        </div>
    );
};

export default MT5CreatePassword;
