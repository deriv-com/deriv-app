import React from 'react';
import PasswordShowIcon from '../../public/images/ic-password-show.svg';
import { useModal } from '../ModalProvider';
import { WalletModal } from '../WalletModal';
import './EnterPassword.scss';

type TProps = {
    marketType?: string;
    onClick: () => void;
    platform?: string;
};

const EnterPassword: React.FC<TProps> = ({ marketType, onClick, platform }) => {
    const { hide } = useModal();

    return (
        <WalletModal className='wallets-enter-password' has_close_icon onClickCloseIcon={hide}>
            <div className='wallets-enter-password--container'>
                <div className='wallets-enter-password-title'>Enter your {platform} password</div>
                <span className='wallets-enter-password-subtitle'>
                    Enter your {platform} password to add a {platform} {marketType} account.
                </span>
                <div className='wallets-enter-password-input'>
                    <input placeholder={`${platform} password`} type='password' />
                    <PasswordShowIcon className='wallets-create-password-input-trailing-icon' />
                </div>
            </div>
            <div className='wallets-enter-password-buttons'>
                <button className='wallets-enter-password-forgot-password-button'>Forgot password?</button>
                <button className='wallets-enter-password-add-button' onClick={onClick}>
                    Add account
                </button>
            </div>
        </WalletModal>
    );
};

export default EnterPassword;
