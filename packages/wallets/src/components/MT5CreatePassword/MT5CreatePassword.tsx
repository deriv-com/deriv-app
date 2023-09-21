import React from 'react';
import MT5PasswordIcon from '../../public/images/ic-mt5-password.svg';
import PasswordShowIcon from '../../public/images/ic-password-show.svg';
import { useModal } from '../ModalProvider';
import WalletModal from '../WalletModal';

const MT5CreatePassword = () => {
    const { hide } = useModal();

    return (
        <WalletModal className='wallets-create-password' should_show_close_icon onClickCloseIcon={hide}>
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
        </WalletModal>
    );
};

export default MT5CreatePassword;
