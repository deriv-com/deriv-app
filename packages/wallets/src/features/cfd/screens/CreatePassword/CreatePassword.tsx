import React from 'react';
import { DerivLightDmt5PasswordIcon, DerivLightIcDxtradePasswordIcon } from '@deriv/quill-icons';
import { WalletButton, WalletPasswordFieldLazy, WalletText } from '../../../../components/Base';
import useDevice from '../../../../hooks/useDevice';
import { TPlatforms } from '../../../../types';
import { validPassword, validPasswordMT5 } from '../../../../utils/password-validation';
import { CFD_PLATFORMS, PlatformDetails } from '../../constants';
import './CreatePassword.scss';

type TProps = {
    isLoading?: boolean;
    onPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPrimaryClick: () => void;
    password: string;
    platform: TPlatforms.All;
};

const CreatePasswordIcon = {
    dxtrade: <DerivLightIcDxtradePasswordIcon height={120} width={120} />,
    mt5: <DerivLightDmt5PasswordIcon height={120} width={120} />,
} as const;

const CreatePassword: React.FC<TProps> = ({ isLoading, onPasswordChange, onPrimaryClick, password, platform }) => {
    const { isDesktop } = useDevice();
    const { title } = PlatformDetails[platform as keyof typeof PlatformDetails];
    const isMT5 = platform === CFD_PLATFORMS.MT5;
    const disableButton = isMT5 ? !validPasswordMT5(password) : !validPassword(password);

    return (
        <div className='wallets-create-password'>
            {CreatePasswordIcon[platform as keyof typeof CreatePasswordIcon]}
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
                mt5Policy={isMT5}
                onChange={onPasswordChange}
                password={password}
            />
            {isDesktop && (
                <WalletButton
                    disabled={!password || isLoading || disableButton}
                    isLoading={isLoading}
                    onClick={onPrimaryClick}
                    size='md'
                >
                    {`Create ${title} password`}
                </WalletButton>
            )}
        </div>
    );
};

export default CreatePassword;
