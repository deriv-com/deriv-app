import React from 'react';
import PasswordShowIcon from '../../public/images/ic-password-show.svg';
import './CreatePassword.scss';

type TProps = {
    icon: React.ReactNode;
    onPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPrimaryClick: () => void;
    platform: string;
};

const CreatePassword: React.FC<TProps> = ({ icon, onPasswordChange, onPrimaryClick, platform }) => {
    return (
        <div className='wallets-create-password'>
            {icon}
            <div className='wallets-create-password-title'>Create a {platform} password</div>
            <span className='wallets-create-password-subtitle'>
                You can use this password for all your {platform} accounts.
            </span>
            <div className='wallets-create-password-input'>
                <input onChange={onPasswordChange} placeholder={`${platform} password`} type='password' />
                <PasswordShowIcon className='wallets-create-password-input-trailing-icon' />
            </div>
            <button className='wallets-create-password-button' onClick={onPrimaryClick}>
                Create {platform} password
            </button>
        </div>
    );
};

export default CreatePassword;
