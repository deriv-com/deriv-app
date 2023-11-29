import React, { useState } from 'react';
import { SentEmailContent } from '../../../../../components';
import { useModal } from '../../../../../components/ModalProvider';
import MT5ChangeInvestorPasswordInputsScreen from './MT5ChangeInvestorPasswordInputsScreen';
import MT5ChangeInvestorPasswordSavedScreen from './MT5ChangeInvestorPasswordSavedScreen';

type TChangeInvestorPasswordScreenIndex = 'emailVerification' | 'introScreen' | 'savedScreen';

const MT5ChangeInvestorPasswordScreens = () => {
    const [activeScreen, setActiveScreen] = useState<TChangeInvestorPasswordScreenIndex>('introScreen');
    const handleClick = (nextScreen: TChangeInvestorPasswordScreenIndex) => setActiveScreen(nextScreen);
    const { hide } = useModal();

    switch (activeScreen) {
        case 'savedScreen':
            return <MT5ChangeInvestorPasswordSavedScreen setNextScreen={hide} />;
        case 'emailVerification':
            return (
                <div className='wallets-change-password__sent-email-wrapper'>
                    <SentEmailContent description='Please click on the link in the email to reset your password.' />
                </div>
            );
        case 'introScreen':
        default:
            return (
                <MT5ChangeInvestorPasswordInputsScreen
                    sendEmail={() => handleClick('emailVerification')}
                    setNextScreen={() => handleClick('savedScreen')}
                />
            );
    }
};

export default MT5ChangeInvestorPasswordScreens;
