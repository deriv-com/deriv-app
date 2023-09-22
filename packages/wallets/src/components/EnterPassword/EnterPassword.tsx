import React from 'react';
import PasswordShowIcon from '../../public/images/ic-password-show.svg';
import './EnterPassword.scss';

type TProps = {
    isLoading?: boolean;
    marketType: string;
    onPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
    platform: string;
};

const EnterPassword: React.FC<TProps> = ({
    isLoading = false,
    marketType,
    onPasswordChange,
    onPrimaryClick,
    onSecondaryClick,
    platform,
}) => {
    return (
        <React.Fragment>
            <div className='wallets-enter-password--container'>
                <div className='wallets-enter-password-title'>Enter your {platform} password</div>
                <span className='wallets-enter-password-subtitle'>
                    Enter your {platform} password to add a {platform} {marketType} account.
                </span>
                <div className='wallets-enter-password-input'>
                    <input onChange={onPasswordChange} placeholder={`${platform} password`} type='password' />
                    <PasswordShowIcon className='wallets-create-password-input-trailing-icon' />
                </div>
            </div>
            <div className='wallets-enter-password-buttons'>
                <button className='wallets-enter-password-forgot-password-button' onClick={onSecondaryClick}>
                    Forgot password?
                </button>
                <button className='wallets-enter-password-add-button' disabled={isLoading} onClick={onPrimaryClick}>
                    Add account
                </button>
            </div>
        </React.Fragment>
    );
};

export default EnterPassword;
