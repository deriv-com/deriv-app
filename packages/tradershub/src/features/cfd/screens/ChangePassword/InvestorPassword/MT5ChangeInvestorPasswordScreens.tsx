import React, { FC, useState } from 'react';
import { Provider } from '@deriv/library';
import MT5ChangeInvestorPasswordInputsScreen from './MT5ChangeInvestorPasswordInputsScreen';
import MT5ChangeInvestorPasswordSavedScreen from './MT5ChangeInvestorPasswordSavedScreen';

type TChangeInvestorPasswordScreenIndex = 'introScreen' | 'savedScreen';

type TProps = {
    setShowEmailSentScreen?: (value: boolean) => void;
};

const MT5ChangeInvestorPasswordScreens: FC<TProps> = ({ setShowEmailSentScreen }) => {
    const [activeScreen, setActiveScreen] = useState<TChangeInvestorPasswordScreenIndex>('introScreen');
    const handleClick = (nextScreen: TChangeInvestorPasswordScreenIndex) => setActiveScreen(nextScreen);
    const { hide } = Provider.useModal();

    switch (activeScreen) {
        case 'savedScreen':
            return (
                <div className='mt-1600 md:mt-2000'>
                    <MT5ChangeInvestorPasswordSavedScreen setNextScreen={hide} />
                </div>
            );
        case 'introScreen':
        default:
            return (
                <div className='mt-1600 md:mt-2000'>
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
