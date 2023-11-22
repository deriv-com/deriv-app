import React, { useState } from 'react';
import { SentEmailContent, WalletButton, WalletsActionScreen, WalletText } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import MT5PasswordIcon from '../../../../public/images/ic-mt5-password.svg';
import MT5PasswordUpdatedIcon from '../../../../public/images/ic-mt5-password-updated.svg';

const MT5ChangeInvestorPasswordScreens = () => {
    type TChangeInvestorPasswordScreenIndex = 'confirmationScreen' | 'emailVerification' | 'introScreen';

    const [activeScreen, setActiveScreen] = useState<TChangeInvestorPasswordScreenIndex>('introScreen');
    const handleClick = (nextScreen: TChangeInvestorPasswordScreenIndex) => setActiveScreen(nextScreen);

    const { hide } = useModal();

    const ChangeInvestorPasswordScreens = {
        confirmationScreen: {
            bodyText: (
                <WalletText align='center' color='error' size='sm'>
                    This will change the password to all of your Deriv MT5 accounts.
                </WalletText>
            ),
            button: (
                <div className='wallets-change-password__btn'>
                    <WalletButton onClick={() => hide()} size='lg' text='Cancel' variant='outlined' />
                    <WalletButton onClick={() => handleClick('emailVerification')} size='lg' text='Confirm' />
                </div>
            ),
            headingText: 'Confirm to change your Deriv MT5 password',
            icon: <MT5PasswordIcon />,
        },
        introScreen: {
            bodyText: (
                <>
                    <WalletText size='sm'>
                        Use this password to grant viewing access to another user. While they may view your trading
                        account, they will not be able to trade or take any other actions.
                    </WalletText>
                    <WalletText size='sm'>
                        If this is the first time you try to create a password, or you have forgotten your password,
                        please reset it.
                    </WalletText>
                </>
            ),
            button: <WalletButton onClick={() => handleClick('confirmationScreen')} size='lg' text='Change password' />,
            headingText: '',
            icon: <MT5PasswordUpdatedIcon />,
        },
    };

    if (activeScreen === 'emailVerification')
        return (
            <div className='wallets-change-password__sent-email-wrapper'>
                <SentEmailContent />
            </div>
        );

    return (
        <div className='wallets-change-password__content'>
            <WalletsActionScreen
                description={ChangeInvestorPasswordScreens[activeScreen].bodyText}
                descriptionSize='sm'
                icon={ChangeInvestorPasswordScreens[activeScreen].icon}
                renderButtons={() => ChangeInvestorPasswordScreens[activeScreen].button}
                title={ChangeInvestorPasswordScreens[activeScreen].headingText}
            />
        </div>
    );
};

export default MT5ChangeInvestorPasswordScreens;
