import React from 'react';
import { WalletButton } from '../../../../components/Base';
import useDevice from '../../../../hooks/useDevice';
import PasswordShowIcon from '../../../../public/images/ic-password-show.svg';
import { TPlatforms } from '../../../../types';
import { PlatformToTitleMapper } from '../../constants';
import './CreatePassword.scss';

// TODO: Refactor the unnecessary props out once FlowProvider is integrated
type TProps = {
    icon: React.ReactNode;
    isLoading?: boolean;
    onPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPrimaryClick: () => void;
    password: string;
    platform: TPlatforms.All;
};

const CreatePassword: React.FC<TProps> = ({
    icon,
    isLoading,
    onPasswordChange,
    onPrimaryClick,
    password,
    platform,
}) => {
    const { isMobile } = useDevice();

    const title = PlatformToTitleMapper[platform];
    return (
        <div className='wallets-create-password'>
            {!isMobile && icon}
            <div className='wallets-create-password-title'>Create a {title} password</div>
            <span className='wallets-create-password-subtitle'>
                You can use this password for all your {title} accounts.
            </span>
            <div className='wallets-create-password-input'>
                <input onChange={onPasswordChange} placeholder={`${title} password`} type='password' />
                <PasswordShowIcon className='wallets-create-password-input-trailing-icon' />
            </div>
            {!isMobile && (
                <WalletButton
                    disabled={!password || isLoading}
                    onClick={onPrimaryClick}
                    size='lg'
                    text={`Create ${title} password`}
                />
            )}
        </div>
    );
};

export default CreatePassword;
