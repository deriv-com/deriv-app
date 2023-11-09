import React from 'react';
import { WalletButton, WalletPasswordField } from '../../../../components/Base';
import useDevice from '../../../../hooks/useDevice';
import { TPlatforms } from '../../../../types';
import { PlatformDetails } from '../../constants';
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

    const title = PlatformDetails[platform].title;
    return (
        <div className='wallets-create-password'>
            {!isMobile && icon}
            <div className='wallets-create-password-title'>Create a {title} password</div>
            <span className='wallets-create-password-subtitle'>
                You can use this password for all your {title} accounts.
            </span>
            <div className='wallets-create-password-input'>
                {/* <input onChange={onPasswordChange} placeholder={`${title} password`} type='password' /> */}
                <WalletPasswordField onChange={onPasswordChange} placeholder={`${title} password`} />
            </div>
            {!isMobile && (
                <WalletButton
                    disabled={!password || isLoading}
                    isLoading={isLoading}
                    onClick={onPrimaryClick}
                    size='lg'
                    text={`Create ${title} password`}
                />
            )}
        </div>
    );
};

export default CreatePassword;
