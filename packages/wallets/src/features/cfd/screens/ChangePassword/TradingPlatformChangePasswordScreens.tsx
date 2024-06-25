import React, { FC, useState } from 'react';
import classNames from 'classnames';
import { useActiveWalletAccount, useSettings, useVerifyEmail } from '@deriv/api-v2';
import { DerivLightDmt5PasswordIcon, DerivLightIcDxtradePasswordIcon } from '@deriv/quill-icons';
import { SentEmailContent, WalletButton, WalletsActionScreen, WalletText } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
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
    const { isMobile } = useDevice();
    const buttonTextSize = isMobile ? 'md' : 'sm';

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
                <WalletText align='center' color='error' size='sm'>
                    This will change the password to all of your {title} accounts.
                </WalletText>
            ),
            button: (
                <div className='wallets-change-password__btn'>
                    <WalletButton onClick={() => hide()} size='lg' textSize={buttonTextSize} variant='outlined'>
                        Cancel
                    </WalletButton>
                    <WalletButton
                        onClick={() => {
                            handleSendEmail();
                            handleClick('emailVerification');
                        }}
                        size='lg'
                        textSize={buttonTextSize}
                    >
                        Confirm
                    </WalletButton>
                </div>
            ),
            headingText: `Confirm to change your ${title} password`,
        },
        introScreen: {
            bodyText: `Use this password to log in to your ${title} accounts on the desktop, web, and mobile apps.`,
            button: (
                <WalletButton onClick={() => handleClick('confirmationScreen')} size='lg' textSize={buttonTextSize}>
                    Change password
                </WalletButton>
            ),
            headingText: `${title} password`,
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
            <WalletsActionScreen
                description={ChangePasswordScreens[activeScreen].bodyText}
                descriptionSize='sm'
                icon={
                    isDerivX ? (
                        <DerivLightIcDxtradePasswordIcon height={120} width={120} />
                    ) : (
                        <DerivLightDmt5PasswordIcon height={120} width={120} />
                    )
                }
                renderButtons={() => ChangePasswordScreens[activeScreen].button}
                title={ChangePasswordScreens[activeScreen].headingText}
            />
        </div>
    );
};

export default TradingPlatformChangePasswordScreens;
