import React from 'react';
import MT5PasswordIcon from '../../public/images/ic-mt5-password.svg';
import PasswordShowIcon from '../../public/images/ic-password-show.svg';

const WalletCreatePasswordModal = () => {
    return (
        <div className='wallets-create-password-modal'>
            <MT5PasswordIcon />
            <h1 className='wallets-create-password-modal-title'>Create a Deriv MT5 password</h1>
            <span className='wallets-create-password-modal-subtitle'>
                You can use this password for all your Deriv MT5 accounts.
            </span>
            <div className='wallets-create-password-modal-input'>
                <input placeholder='Deriv MT5 password' type='password' />
                <PasswordShowIcon className='wallets-create-password-modal-input-trailing-icon' />
            </div>
            <button className='wallets-create-password-modal-button'>Create Deriv MT5 password</button>
        </div>
    );
};

export default WalletCreatePasswordModal;
