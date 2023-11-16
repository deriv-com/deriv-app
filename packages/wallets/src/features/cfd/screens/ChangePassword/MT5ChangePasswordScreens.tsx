import React, { useState } from 'react';
import { WalletButton, WalletText } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import EmailIcon from '../../../../public/images/change-password-email.svg';
import MT5PasswordIcon from '../../../../public/images/ic-mt5-password.svg';
import ContentTemplate from './ContentTemplate';

const MT5ChangePasswordScreens = () => {
    const [activeScreen, setActiveScreen] = useState(0);

    const handleClick = () => setActiveScreen(prev => prev + 1);

    const { hide } = useModal();

    const ChangePasswordScreens = [
        {
            bodyText: (
                <WalletText align='center' size='sm'>
                    Use this password to log in to your Deriv MT5 accounts on the desktop, web, and mobile apps.
                </WalletText>
            ),
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
                <>
                    {/* TODO: Double confirm with the designers or QA on the behavior of the Cancel button*/}
                    <WalletButton onClick={() => hide()} size='lg' text='Cancel' variant='outlined' />
                    {/* TODO: Append logic send email for password reset to Confirm Button */}
                    <WalletButton onClick={handleClick} size='lg' text='Confirm' />
                </>
            ),
            headingText: 'Confirm to change your Deriv MT5 password',
            icon: <MT5PasswordIcon />,
        },
        {
            bodyText: (
                <WalletText align='center' size='sm'>
                    Please click on the link in the email to change your Deriv MT5 password.
                </WalletText>
            ),
            button: <WalletButton onClick={() => hide()} size='lg' text='Didn’t receive the email?' variant='ghost' />, // TODO: Add logic send email password reset
            headingText: 'We’ve sent you an email',
            icon: <EmailIcon />,
        },
    ];

    return (
        <ContentTemplate
            bodyText={ChangePasswordScreens[activeScreen].bodyText}
            button={ChangePasswordScreens[activeScreen].button}
            headingText={ChangePasswordScreens[activeScreen].headingText}
            icon={ChangePasswordScreens[activeScreen].icon}
        />
    );
};

export default MT5ChangePasswordScreens;
