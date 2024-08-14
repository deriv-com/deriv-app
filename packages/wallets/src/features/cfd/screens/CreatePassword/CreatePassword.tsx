import React from 'react';
import { DerivLightDmt5PasswordIcon, DerivLightIcDxtradePasswordIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { WalletPasswordFieldLazy } from '../../../../components/Base';
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
    const { localize } = useTranslations();

    const { title } = PlatformDetails[platform as keyof typeof PlatformDetails];
    const isMT5 = platform === CFD_PLATFORMS.MT5;
    const disableButton = isMT5 ? !validPasswordMT5(password) : !validPassword(password);

    return (
        <div className='wallets-create-password'>
            {CreatePasswordIcon[platform as keyof typeof CreatePasswordIcon]}
            <div className='wallets-create-password__text'>
                <Text align='center' lineHeight='xl' weight='bold'>
                    <Localize i18n_default_text='Create a {{title}} password' values={{ title }} />
                </Text>
                <Text align='center' size='sm'>
                    <Localize
                        i18n_default_text='You can use this password for all your {{title}} accounts.'
                        values={{ title }}
                    />
                </Text>
            </div>
            <WalletPasswordFieldLazy
                label={localize('{{title}} password', { title })}
                mt5Policy={isMT5}
                onChange={onPasswordChange}
                password={password}
            />
            {isDesktop && (
                <Button
                    disabled={!password || isLoading || disableButton}
                    isLoading={isLoading}
                    onClick={onPrimaryClick}
                    size='md'
                >
                    <Localize i18n_default_text='Create {{title}} password' values={{ title }} />
                </Button>
            )}
        </div>
    );
};

export default CreatePassword;
