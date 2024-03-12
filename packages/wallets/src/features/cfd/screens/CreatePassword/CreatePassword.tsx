import React from 'react';
import { WalletButton, WalletPasswordFieldLazy, WalletText } from '../../../../components/Base';
import useDevice from '../../../../hooks/useDevice';
import { TPlatforms } from '../../../../types';
import { validPassword, validPasswordMT5 } from '../../../../utils/password-validation';
import { PlatformDetails } from '../../constants';
import './CreatePassword.scss';

type TProps = {
    hasMT5account?: boolean;
    icon: React.ReactNode;
    isLoading?: boolean;
    onPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPrimaryClick: () => void;
    password: string;
    platform: TPlatforms.All;
};

const CreatePassword: React.FC<TProps> = ({
    hasMT5account,
    icon,
    isLoading,
    onPasswordChange,
    onPrimaryClick,
    password,
    platform,
}) => {
    const { isMobile } = useDevice();

    const title = PlatformDetails[platform].title;
    const passwordValidation = hasMT5account ? validPassword(password) : validPasswordMT5(password);
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
                mt5Policy={!hasMT5account}
                onChange={onPasswordChange}
                password={password}
            />
            {!isMobile && (
                <WalletButton
                    disabled={!password || isLoading || !passwordValidation}
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
