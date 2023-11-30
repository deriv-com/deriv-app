import React, { useState } from 'react';
import { useActiveWalletAccount, useSettings, useVerifyEmail } from '@deriv/api';
import { SentEmailContent, WalletButton, WalletsActionScreen, WalletText } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import MT5PasswordIcon from '../../../../public/images/ic-mt5-password.svg';
import { TPlatforms } from '../../../../types';
import { platformPasswordResetRedirectLink } from '../../../../utils/cfdUtils';

type MT5ChangePasswordScreensProps = {
    isVirtual?: boolean;
    platform: TPlatforms.All;
    platformTitle: string;
};

const MT5ChangePasswordScreens: React.FC<MT5ChangePasswordScreensProps> = ({ platform, platformTitle }) => {
    type TChangePasswordScreenIndex = 'confirmationScreen' | 'emailVerification' | 'introScreen';
    const [activeScreen, setActiveScreen] = useState<TChangePasswordScreenIndex>('introScreen');
    const handleClick = (nextScreen: TChangePasswordScreenIndex) => setActiveScreen(nextScreen);

    const { hide } = useModal();
    const { data } = useSettings();
    const { mutate } = useVerifyEmail();
    const { data: activeWallet } = useActiveWalletAccount();

    const handleSendEmail = async () => {
        if (data.email) {
            await mutate({
                type:
                    platform === 'mt5'
                        ? 'trading_platform_mt5_password_reset'
                        : 'trading_platform_dxtrade_password_reset',
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
                    This will change the password to all of your {platformTitle} accounts.
                </WalletText>
            ),
            button: (
                <div className='wallets-change-password__btn'>
                    <WalletButton onClick={() => hide()} size='lg' text='Cancel' variant='outlined' />
                    <WalletButton
                        onClick={() => {
                            handleSendEmail();
                            handleClick('emailVerification');
                        }}
                        size='lg'
                        text='Confirm'
                    />
                </div>
            ),
            headingText: `Confirm to change your ${platformTitle} password`,
            icon: <MT5PasswordIcon />,
        },
        introScreen: {
            bodyText: `Use this password to log in to your ${platformTitle} accounts on the desktop, web, and mobile apps.`,
            button: <WalletButton onClick={() => handleClick('confirmationScreen')} size='lg' text='Change password' />,
            headingText: `${platformTitle} password`,
            icon: <MT5PasswordIcon />,
        },
    };

    if (activeScreen === 'emailVerification')
        return (
            <div className='wallets-change-password__sent-email-wrapper'>
                <SentEmailContent platform={platform} />
            </div>
        );

    return (
        <div className='wallets-change-password__content'>
            <WalletsActionScreen
                description={ChangePasswordScreens[activeScreen].bodyText}
                descriptionSize='sm'
                icon={ChangePasswordScreens[activeScreen].icon}
                renderButtons={() => ChangePasswordScreens[activeScreen].button}
                title={ChangePasswordScreens[activeScreen].headingText}
            />
        </div>
    );
};

export default MT5ChangePasswordScreens;
