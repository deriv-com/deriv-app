import React from 'react';
import { WalletButton, WalletPasswordFieldLazy, WalletText } from '../../../../components/Base';
import useDevice from '../../../../hooks/useDevice';
import { TPlatforms } from '../../../../types';
import { validPasswordMT5 } from '../../../../utils/password-validation';
import { PlatformDetails } from '../../constants';
import './CreatePassword.scss';

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
    const { isDesktop } = useDevice();
    const { title } = PlatformDetails[platform];

    return (
        <div className='wallets-create-password'>
            {icon}
            <div className='wallets-create-password__text'>
                <WalletText align='center' lineHeight='xl' weight='bold'>
                    Create a {title} password
                </WalletText>
                <WalletText align='center' size='sm'>
                    You can use this password for all your {title} accounts.
                </WalletText>
            </div>
            <WalletPasswordFieldLazy
                label={`${title} password`}
                mt5Policy
                onChange={onPasswordChange}
                password={password}
            />
            {isDesktop && (
                <WalletButton
                    disabled={!password || isLoading || !validPasswordMT5(password)}
                    isLoading={isLoading}
                    onClick={onPrimaryClick}
                    size='lg'
                >
                    {`Create ${title} password`}
                </WalletButton>
            )}
        </div>
    );
};

export default CreatePassword;
