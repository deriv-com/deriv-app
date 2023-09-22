import React from 'react';
import { useAvailableMT5Accounts, useCreateOtherCFDAccount } from '@deriv/api';
import PasswordShowIcon from '../../public/images/ic-password-show.svg';
import './EnterPassword.scss';

type TPlatformMT5 = NonNullable<ReturnType<typeof useAvailableMT5Accounts>['data']>[number]['platform'];

type TPlatformOtherAccounts = Parameters<
    NonNullable<ReturnType<typeof useCreateOtherCFDAccount>['mutate']>
>[0]['payload']['platform'];

type TPlatform = TPlatformMT5 | TPlatformOtherAccounts;

type TMarketType = Parameters<
    NonNullable<ReturnType<typeof useCreateOtherCFDAccount>['mutate']>
>[0]['payload']['market_type'];

type TProps = {
    isLoading?: boolean;
    marketType: TMarketType;
    onPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
    platform: TPlatform;
};

const platformToTitleMapper: Record<TPlatform, string> = {
    ctrader: 'cTrader',
    derivez: 'Deriv EZ',
    dxtrade: 'Deriv X',
    mt5: 'Deriv MT5',
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
            <div className='wallets-enter-password'>
                <div className='wallets-enter-password--container'>
                    <div className='wallets-enter-password-title'>
                        Enter your {platformToTitleMapper[platform]} password
                    </div>
                    <span className='wallets-enter-password-subtitle'>
                        Enter your {platformToTitleMapper[platform]} password to add a {platformToTitleMapper[platform]}{' '}
                        {marketType} account.
                    </span>
                    <div className='wallets-enter-password-input'>
                        <input
                            onChange={onPasswordChange}
                            placeholder={`${platformToTitleMapper[platform]} password`}
                            type='password'
                        />
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
