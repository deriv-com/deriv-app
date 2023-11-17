import React, { useState } from 'react';
import { WalletButton, WalletsActionScreen, WalletText } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import EmailIcon from '../../../../public/images/change-password-email.svg';
import MT5PasswordIcon from '../../../../public/images/ic-mt5-password.svg';

const MT5ChangePasswordScreens = () => {
    const [activeScreen, setActiveScreen] = useState(0);

    const handleClick = () => setActiveScreen(prev => prev + 1);

    const { hide } = useModal();

    const ChangePasswordScreens = [
        {
            bodyText: 'Use this password to log in to your Deriv MT5 accounts on the desktop, web, and mobile apps.',
            button: <WalletButton onClick={handleClick} size='lg' text='Change password' />,
            headingText: 'Deriv MT5 password',
            icon: <MT5PasswordIcon />,
        },
        {
            bodyText: (
                <WalletText align='center' color='error' size='sm'>
                    This will change the password to all of your Deriv MT5 accounts.
                </WalletText>
            ),
            button: (
                <div className='wallets-change-password__btn'>
                    {/* TODO: Double confirm with the designers or QA on the behavior of the Cancel button*/}
                    <WalletButton onClick={() => hide()} size='lg' text='Cancel' variant='outlined' />
                    {/* TODO: Append logic send email for password reset to Confirm Button */}
                    <WalletButton onClick={handleClick} size='lg' text='Confirm' />
                </div>
            ),
            headingText: 'Confirm to change your Deriv MT5 password',
            icon: <MT5PasswordIcon />,
        },
        {
            bodyText: 'Please click on the link in the email to change your Deriv MT5 password.',
            button: <WalletButton onClick={() => hide()} size='lg' text='Didn’t receive the email?' variant='ghost' />, // TODO: Add logic send email password reset
            headingText: 'We’ve sent you an email',
            icon: <EmailIcon />,
        },
    ];

    return (
        <WalletsActionScreen
            desciptionSize='sm'
            description={ChangePasswordScreens[activeScreen].bodyText}
            icon={ChangePasswordScreens[activeScreen].icon}
            renderButtons={() => ChangePasswordScreens[activeScreen].button}
            title={ChangePasswordScreens[activeScreen].headingText}
        />
    );
};

export default MT5ChangePasswordScreens;
