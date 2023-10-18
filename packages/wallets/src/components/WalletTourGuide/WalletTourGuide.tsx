import React from 'react';
import Joyride, { CallBackProps } from 'react-joyride';
import { TooltipComponent, tourStepConfig } from './WalletTourGuideSettings';
import './WalletTourGuide.scss';

type TProps = {
    isStarted?: boolean;
    setIsStarted?: (value: boolean) => void;
};

const WalletTourGuide = ({ isStarted = false, setIsStarted }: TProps) => {
    const callbackHandle = (data: CallBackProps) => {
        if (data.action === 'reset') {
            setIsStarted?.(false);
        }
    };

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
