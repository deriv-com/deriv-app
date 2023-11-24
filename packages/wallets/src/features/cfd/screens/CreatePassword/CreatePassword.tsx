import React from 'react';
import { WalletButton, WalletPasswordField, WalletText } from '../../../../components/Base';
import useDevice from '../../../../hooks/useDevice';
import { TPlatforms } from '../../../../types';
import { validPassword } from '../../../../utils/passwordUtils';
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
    const { isMobile } = useDevice();

    const title = PlatformDetails[platform].title;
    return (
        <div className='wallets-create-password'>
            {!isMobile && icon}
            <WalletText lineHeight='xl' weight='bold'>
                Create a {title} password
            </WalletText>
            <WalletText align='center' size='sm'>
                You can use this password for all your {title} accounts.
            </WalletText>

            <WalletPasswordField label={`${title} password`} onChange={onPasswordChange} password={password} />
            {!isMobile && (
                <WalletButton
                    disabled={!password || isLoading || !validPassword(password)}
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
