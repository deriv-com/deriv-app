import React, { FC, useState } from 'react';
import classNames from 'classnames';
import { useActiveWalletAccount, useSettings, useVerifyEmail } from '@deriv/api-v2';
import { DerivLightDmt5PasswordIcon, DerivLightIcDxtradePasswordIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { ActionScreen, Button, Text, useDevice } from '@deriv-com/ui';
import { SentEmailContent } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import { TPlatforms } from '../../../../types';
import { platformPasswordResetRedirectLink } from '../../../../utils/cfd';
import { PlatformDetails } from '../../constants';

type TradingPlatformChangePasswordScreensProps = {
    isVirtual?: boolean;
    platform: TPlatforms.All;
};

const TradingPlatformChangePasswordScreens: FC<TradingPlatformChangePasswordScreensProps> = ({ platform }) => {
    type TChangePasswordScreenIndex = 'confirmationScreen' | 'emailVerification' | 'introScreen';
    const [activeScreen, setActiveScreen] = useState<TChangePasswordScreenIndex>('introScreen');
    const handleClick = (nextScreen: TChangePasswordScreenIndex) => setActiveScreen(nextScreen);

    const { hide } = useModal();
    const { data } = useSettings();
    const { mutate } = useVerifyEmail();
    const { data: activeWallet } = useActiveWalletAccount();
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();
    const buttonTextSize = isDesktop ? 'sm' : 'md';
    const { title } = PlatformDetails[platform];

    const isDerivX = platform === PlatformDetails.dxtrade.platform;

    const handleSendEmail = async () => {
        if (data.email) {
            await mutate({
                type: isDerivX ? 'trading_platform_dxtrade_password_reset' : 'trading_platform_mt5_password_reset',
                url_parameters: {
                    redirect_to: platformPasswordResetRedirectLink(platform, activeWallet?.is_virtual),
                },
                verify_email: data.email,
            });
        }
    };

    const ChangePasswordScreens = {
        confirmationScreen: {
            bodyText: (
                <Text align='center' color='error' size='sm'>
                    <Localize
                        i18n_default_text='This will change the password to all of your {{title}} accounts.'
                        values={{ title }}
                    />
                </Text>
            ),
            button: (
                <div className='wallets-change-password__btn'>
                    <Button color='black' onClick={() => hide()} size='lg' textSize={buttonTextSize} variant='outlined'>
                        <Localize i18n_default_text='Cancel' />
                    </Button>
                    <Button
                        onClick={() => {
                            handleSendEmail();
                            handleClick('emailVerification');
                        }}
                        size='lg'
                        textSize={buttonTextSize}
                    >
                        <Localize i18n_default_text='Confirm' />
                    </Button>
                </div>
            ),
            headingText: localize('Confirm to change your {{title}} password', { title }),
        },
        introScreen: {
            bodyText: localize(
                'Use this password to log in to your {{title}} accounts on the desktop, web, and mobile apps.',
                { title }
            ),
            button: (
                <Button onClick={() => handleClick('confirmationScreen')} size='lg' textSize={buttonTextSize}>
                    <Localize i18n_default_text='Change password' />
                </Button>
            ),
            headingText: localize('{{title}} password', { title }),
        },
    };

    if (activeScreen === 'emailVerification') {
        return (
            <div
                className={classNames('wallets-change-password__sent-email-content-wrapper', {
                    'wallets-change-password__sent-email-content-wrapper--dxtrade': platform === 'dxtrade',
                })}
            >
                <SentEmailContent isChangePassword platform={platform} />
            </div>
        );
    }

    return (
        <div
            className={classNames('wallets-change-password__content', {
                'wallets-change-password__content--dxtrade': platform === 'dxtrade',
            })}
        >
            <ActionScreen
                actionButtons={ChangePasswordScreens[activeScreen].button}
                description={ChangePasswordScreens[activeScreen].bodyText}
                descriptionSize='sm'
                icon={
                    isDerivX ? (
                        <DerivLightIcDxtradePasswordIcon height={120} width={120} />
                    ) : (
                        <DerivLightDmt5PasswordIcon height={120} width={120} />
                    )
                }
                title={ChangePasswordScreens[activeScreen].headingText}
            />
        </div>
    );
};

export default TradingPlatformChangePasswordScreens;
