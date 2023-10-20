import React from 'react';
import PasswordShowIcon from '../../../../public/images/ic-password-show.svg';
import './EnterPassword.scss';
import { TMarketTypes, TPlatforms } from '../../types';
import { PlatformToTitleMapper } from '../../constants';

type TProps = {
    isLoading?: boolean;
    marketType: TMarketTypes.CreateOtherCFDAccount;
    onPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
    platform: TPlatforms.All;
};

const EnterPassword: React.FC<TProps> = ({
    isLoading = false,
    marketType,
    onPasswordChange,
    onPrimaryClick,
    onSecondaryClick,
    platform,
}) => {
    const title = PlatformToTitleMapper[platform];
    return (
        <React.Fragment>
            <div className='wallets-enter-password'>
                <div className='wallets-enter-password--container'>
                    <div className='wallets-enter-password-title'>Enter your {title} password</div>
                    <span className='wallets-enter-password-subtitle'>
                        Enter your {title} password to add a {title} {marketType} account.
                    </span>
                    <div className='wallets-enter-password-input'>
                        <input onChange={onPasswordChange} placeholder={`${title} password`} type='password' />
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
            </div>
        </React.Fragment>
    );
};

export default EnterPassword;
