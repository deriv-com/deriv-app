import React from 'react';
import { DerivLightDmt5PasswordIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { WalletPasswordFieldLazy } from '../../../../components/Base';
import { THooks, TPlatforms } from '../../../../types';
import { validPassword, validPasswordMT5 } from '../../../../utils/password-validation';
import { CFDPasswordModalTnc } from '../../components/CFDPasswordModalTnc';
import { CFD_PLATFORMS, PlatformDetails, PRODUCT } from '../../constants';
import './CreatePasswordMT5.scss';

type TProps = {
    isLoading?: boolean;
    isTncChecked: boolean;
    isVirtual?: boolean;
    onPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPrimaryClick: () => void;
    onTncChange: () => void;
    password: string;
    platform: TPlatforms.All;
    product?: THooks.AvailableMT5Accounts['product'];
};

const CreatePasswordMT5: React.FC<TProps> = ({
    isLoading,
    isTncChecked,
    isVirtual,
    onPasswordChange,
    onPrimaryClick,
    onTncChange,
    password,
    platform,
    product,
}) => {
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();
    const { title } = PlatformDetails[platform as keyof typeof PlatformDetails];
    const accountTitle = isVirtual ? localize('demo {{title}}', { title }) : title;
    const isMT5 = platform === CFD_PLATFORMS.MT5;
    const disableButton = isMT5 ? !validPasswordMT5(password) : !validPassword(password);

    return (
        <div className='wallets-create-password-mt5'>
            {isDesktop && (
                <div className='wallets-create-password-mt5__header'>
                    <Text lineHeight='xl' weight='bold'>
                        <Localize i18n_default_text='Create a {{accountTitle}} password' values={{ accountTitle }} />
                    </Text>
                </div>
            )}
            <div className='wallets-create-password-mt5__body'>
                <DerivLightDmt5PasswordIcon height={120} width={120} />
                <Text align='start' size={isDesktop ? 'sm' : 'md'}>
                    <Localize
                        i18n_default_text='Note: You can use this password for all your {{title}} accounts.'
                        values={{ title }}
                    />
                </Text>
                <WalletPasswordFieldLazy
                    label={localize('{{title}} password', { title })}
                    mt5Policy={isMT5}
                    onChange={onPasswordChange}
                    password={password}
                />
                {product === PRODUCT.ZEROSPREAD && !isVirtual && (
                    <CFDPasswordModalTnc
                        checked={isTncChecked}
                        onChange={onTncChange}
                        platform={platform}
                        product={product}
                    />
                )}
            </div>

            {isDesktop && (
                <div className='wallets-create-password-mt5__footer'>
                    <Button
                        disabled={!password || isLoading || disableButton || !isTncChecked}
                        isLoading={isLoading}
                        onClick={onPrimaryClick}
                        size='lg'
                        textSize='sm'
                    >
                        <Localize i18n_default_text='Create {{title}} password' values={{ title }} />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CreatePasswordMT5;
