import React, { useEffect, useState } from 'react';
import Joyride, { CallBackProps } from 'react-joyride';
import { TooltipComponent, tourStepConfig } from './WalletTourGuideSettings';
import './WalletTourGuide.scss';

const WalletTourGuide = () => {
    const key = 'walletsOnboarding';
    const [isStarted, setIsStarted] = useState(localStorage.getItem(key) === 'started');

    const callbackHandle = (data: CallBackProps) => {
        if (data.action === 'reset') {
            localStorage.removeItem(key);
            setIsStarted(false);
        }
    };

    useEffect(() => {
        const onStorage = () => {
            setIsStarted(localStorage.getItem(key) === 'started');
        };

        window.addEventListener('storage', onStorage);

        return () => {
            window.removeEventListener('storage', onStorage);
        };
    }, []);

    return (
        <Joyride
            callback={callbackHandle}
            continuous
            disableCloseOnEsc
            disableScrolling
            floaterProps={{
                disableAnimation: true,
            }}
            run={isStarted}
            steps={tourStepConfig}
            tooltipComponent={TooltipComponent}
        />
    );
};

export default WalletTourGuide;
