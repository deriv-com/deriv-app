import React from 'react';
import { WalletButton } from '../../../../components/Base';
import useDevice from '../../../../hooks/useDevice';
import PasswordShowIcon from '../../../../public/images/ic-password-show.svg';
import { TMarketTypes, TPlatforms } from '../../../../types';
import { PlatformToTitleMapper } from '../../constants';
import './EnterPassword.scss';

// TODO: Refactor the unnecessary props out once FlowProvider is integrated
type TProps = {
    isLoading?: boolean;
    marketType: TMarketTypes.CreateOtherCFDAccount;
    onPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
    password: string;
    platform: TPlatforms.All;
};

const EnterPassword: React.FC<TProps> = ({
    isLoading,
    marketType,
    onPasswordChange,
    onPrimaryClick,
    onSecondaryClick,
    password,
    platform,
}) => {
    const { isDesktop } = useDevice();
    const title = PlatformToTitleMapper[platform];
    return (
        <div className='wallets-enter-password'>
            <div className='wallets-enter-password--container'>
                {isDesktop && <div className='wallets-enter-password-title'>Enter your {title} password</div>}
                <span className='wallets-enter-password-subtitle'>
                    Enter your {title} password to add a {title} {marketType} account.
                </span>
                <div className='wallets-enter-password-input'>
                    <input onChange={onPasswordChange} placeholder={`${title} password`} type='password' />
                    <PasswordShowIcon className='wallets-create-password-input-trailing-icon' />
                </div>
            </div>
            {isDesktop && (
                <div className='wallets-enter-password-buttons'>
                    <WalletButton onClick={onSecondaryClick} size='lg' text='Forgot password?' variant='outlined' />
                    <WalletButton
                        disabled={!password || isLoading}
                        onClick={onPrimaryClick}
                        size='lg'
                        text='Add account'
                    />
                </div>
            )}
        </div>
    );
};

export default EnterPassword;
