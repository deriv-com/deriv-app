import React from 'react';
import PasswordShowIcon from '../../../../public/images/ic-password-show.svg';
import './CreatePassword.scss';
import { TPlatforms } from '../../types';

const platformToTitleMapper: Record<TPlatforms.All, string> = {
    ctrader: 'cTrader',
    derivez: 'Deriv EZ',
    dxtrade: 'Deriv X',
    mt5: 'Deriv MT5',
};

type TProps = {
    icon: React.ReactNode;
    onPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPrimaryClick: () => void;
    platform: TPlatforms.All;
};

const CreatePassword: React.FC<TProps> = ({ icon, onPasswordChange, onPrimaryClick, platform }) => {
    const title = platformToTitleMapper[platform];
    return (
        <div className='wallets-create-password'>
            {icon}
            <div className='wallets-create-password-title'>Create a {title} password</div>
            <span className='wallets-create-password-subtitle'>
                You can use this password for all your {title} accounts.
            </span>
            <div className='wallets-create-password-input'>
                <input onChange={onPasswordChange} placeholder={`${title} password`} type='password' />
                <PasswordShowIcon className='wallets-create-password-input-trailing-icon' />
            </div>
            <button className='wallets-create-password-button' onClick={onPrimaryClick}>
                Create {title} password
            </button>
        </div>
    );
};

export default CreatePassword;
