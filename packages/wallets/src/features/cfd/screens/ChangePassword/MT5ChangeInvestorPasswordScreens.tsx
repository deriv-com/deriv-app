import React, { useState } from 'react';
import {
    SentEmailContent,
    WalletButton,
    WalletPasswordField,
    WalletsActionScreen,
    WalletText,
} from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import MT5PasswordUpdatedIcon from '../../../../public/images/ic-mt5-password-updated.svg';

type TChangeInvestorPasswordScreenIndex = 'emailVerification' | 'introScreen' | 'savedScreen';

const MT5ChangeInvestorPasswordScreens = () => {
    const [currentInvestorPassword, setCurrentInvestorPassword] = useState('');
    const [newInvestorPassword, setNewInvestorPassword] = useState('');

    const [activeScreen, setActiveScreen] = useState<TChangeInvestorPasswordScreenIndex>('introScreen');
    const handleClick = (nextScreen: TChangeInvestorPasswordScreenIndex) => setActiveScreen(nextScreen);

    const { isMobile } = useDevice();
    const { hide } = useModal();

    const ChangeInvestorPasswordScreens = {
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
            button: (
                <div className='wallets-change-password__investor-password'>
                    <div className='wallets-change-password__investor-password-fields'>
                        <WalletPasswordField
                            key='current_password'
                            label={`Current investor password`}
                            onChange={e => setCurrentInvestorPassword(e.target.value)}
                            password={currentInvestorPassword}
                        />
                        <WalletPasswordField
                            key='new_password'
                            label={`New investor password`}
                            onChange={e => setNewInvestorPassword(e.target.value)}
                            password={newInvestorPassword}
                        />
                    </div>
                    <div className='wallets-change-password__investor-password-buttons'>
                        <WalletButton
                            disabled={currentInvestorPassword.length < 8 || newInvestorPassword.length < 8}
                            onClick={() => handleClick('savedScreen')}
                            size={isMobile ? 'lg' : 'md'}
                            text='Change investor password'
                        />
                        <WalletButton
                            onClick={() => handleClick('emailVerification')}
                            size={isMobile ? 'lg' : 'md'}
                            text='Create or reset investor password'
                            variant='ghost'
                        />
                    </div>
                </div>
            ),
            headingText: undefined,
            icon: undefined,
        },
        savedScreen: {
            bodyText: (
                <WalletText align='center' size='sm'>
                    Your investor password has been changed.
                </WalletText>
            ),
            button: <WalletButton onClick={() => hide()} size='lg' text='Okay' />,
            headingText: 'Password saved',
            icon: <MT5PasswordUpdatedIcon />,
        },
    };

    if (activeScreen === 'emailVerification')
        return (
            <div className='wallets-change-password__sent-email-wrapper'>
                <SentEmailContent description='Please click on the link in the email to reset your password.' />
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
