import React, { FC, useState } from 'react';
import { useModal } from '../../../../../components/ModalProvider';
import MT5ChangeInvestorPasswordInputsScreen from './MT5ChangeInvestorPasswordInputsScreen';
import MT5ChangeInvestorPasswordSavedScreen from './MT5ChangeInvestorPasswordSavedScreen';
import './MT5ChangeInvestorPasswordScreens.scss';

type TChangeInvestorPasswordScreenIndex = 'introScreen' | 'savedScreen';

type TProps = {
    setShowEmailSentScreen?: (value: boolean) => void;
};

const MT5ChangeInvestorPasswordScreens: FC<TProps> = ({ setShowEmailSentScreen }) => {
    const [activeScreen, setActiveScreen] = useState<TChangeInvestorPasswordScreenIndex>('introScreen');
    const handleClick = (nextScreen: TChangeInvestorPasswordScreenIndex) => setActiveScreen(nextScreen);
    const { hide } = useModal();

    switch (activeScreen) {
        case 'savedScreen':
            return (
                <div className='wallets-change-investor-password-screens__content'>
                    <MT5ChangeInvestorPasswordSavedScreen setNextScreen={hide} />
                </div>
            );
        case 'introScreen':
        default:
            return (
                <div className='wallets-change-investor-password-screens__content'>
                    <MT5ChangeInvestorPasswordInputsScreen
                        sendEmail={() => {
                            setShowEmailSentScreen?.(true);
                        }}
                        setNextScreen={() => handleClick('savedScreen')}
                    />
                </div>
            );
    }
};

export default MT5ChangeInvestorPasswordScreens;
