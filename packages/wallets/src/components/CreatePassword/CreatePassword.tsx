import React from 'react';
import { useCreateOtherCFDAccount } from '@deriv/api';
import PasswordShowIcon from '../../public/images/ic-password-show.svg';
import './CreatePassword.scss';

type TPlatform = Parameters<
    NonNullable<ReturnType<typeof useCreateOtherCFDAccount>['mutate']>
>[0]['payload']['platform'];

const platformToTitleMapper: Record<TPlatform, string> = {
    ctrader: 'cTrader',
    derivez: 'Deriv EZ',
    dxtrade: 'Deriv X',
};

type TProps = {
    icon: React.ReactNode;
    onPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPrimaryClick: () => void;
    platform: TPlatform;
};

const CreatePassword: React.FC<TProps> = ({ icon, onPasswordChange, onPrimaryClick, platform }) => {
    return (
        <div className='wallets-create-password'>
            {icon}
            <div className='wallets-create-password-title'>Create a {platformToTitleMapper[platform]} password</div>
            <span className='wallets-create-password-subtitle'>
                You can use this password for all your {platformToTitleMapper[platform]} accounts.
            </span>
            <div className='wallets-create-password-input'>
                <input
                    onChange={onPasswordChange}
                    placeholder={`${platformToTitleMapper[platform]}} password`}
                    type='password'
                />
                <PasswordShowIcon className='wallets-create-password-input-trailing-icon' />
            </div>
            <button className='wallets-create-password-button' onClick={onPrimaryClick}>
                Create {platformToTitleMapper[platform]} password
            </button>
        </div>
    );
};

export default CreatePassword;
