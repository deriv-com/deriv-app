import React, { useState } from 'react';
import { useQueryParams } from '@/hooks';
import MT5ChangeInvestorPasswordInputsScreen from './MT5ChangeInvestorPasswordInputsScreen';
import MT5ChangeInvestorPasswordSavedScreen from './MT5ChangeInvestorPasswordSavedScreen';

type TChangeInvestorPasswordScreenIndex = 'introScreen' | 'savedScreen';

type TMT5ChangeInvestorPasswordScreens = {
    setShowEmailSentScreen?: (value: boolean) => void;
};

const MT5ChangeInvestorPasswordScreens = ({ setShowEmailSentScreen }: TMT5ChangeInvestorPasswordScreens) => {
    const [activeScreen, setActiveScreen] = useState<TChangeInvestorPasswordScreenIndex>('introScreen');
    const handleClick = (nextScreen: TChangeInvestorPasswordScreenIndex) => setActiveScreen(nextScreen);
    const { openModal } = useQueryParams();

    switch (activeScreen) {
        case 'savedScreen':
            return (
                <div className='mt-32 md:mt-40'>
                    <MT5ChangeInvestorPasswordSavedScreen setNextScreen={() => openModal} />
                </div>
            );
        case 'introScreen':
        default:
            return (
                <div className='mt-32 md:mt-40'>
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
