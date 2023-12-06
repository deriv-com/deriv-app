import React, { FC, useState } from 'react';
import { useActiveWalletAccount, useSettings, useVerifyEmail } from '@deriv/api';
import { SentEmailContent, WalletButton, WalletsActionScreen, WalletText } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import DerivXPasswordIcon from '../../../../public/images/ic-derivx-password-updated.svg';
import MT5PasswordIcon from '../../../../public/images/ic-mt5-password.svg';
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
                    <WalletButton onClick={() => hide()} size='lg' variant='outlined'>
                        Cancel
                    </WalletButton>
                    <WalletButton
                        onClick={() => {
                            handleSendEmail();
                            handleClick('emailVerification');
                        }}
                        size='lg'
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
                <WalletButton onClick={() => handleClick('confirmationScreen')} size='lg'>
                    Change password
                </WalletButton>
            ),
            headingText: `${title} password`,
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
                icon={isDerivX ? <DerivXPasswordIcon /> : <MT5PasswordIcon />}
                renderButtons={() => ChangePasswordScreens[activeScreen].button}
                title={ChangePasswordScreens[activeScreen].headingText}
            />
        </div>
    );
};

export default TradingPlatformChangePasswordScreens;
