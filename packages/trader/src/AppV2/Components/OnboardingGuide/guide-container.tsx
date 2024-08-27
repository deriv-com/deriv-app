import React from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { Localize } from '@deriv/translations';
import GuideTooltip from './guide-tooltip';

type TGuideContainerProps = {
    should_run: boolean;
    onFinishGuide: () => void;
};

const GuideContainer = ({ should_run, onFinishGuide }: TGuideContainerProps) => {
    const steps = [
        {
            target: '.trade__trade-types',
            title: <Localize i18n_default_text='Explore trade types (1/6)' />,
            content: <Localize i18n_default_text='Scroll left or right to explore trade types.' />,
            disableBeacon: true,
            offset: 0,
        },
        {
            target: '.market-selector__container',
            title: <Localize i18n_default_text='Choose a market (2/6)' />,
            content: <Localize i18n_default_text='View available markets here.' />,
            disableBeacon: true,
            offset: 0,
            placement: 'bottom-start' as Step['placement'],
        },
        {
            target: '.trade-params',
            title: <Localize i18n_default_text='Open your trade (3/6)' />,
            content: <Localize i18n_default_text='Specify your trade parameters.' />,
            disableBeacon: true,
            offset: 0,
        },
    ];

    const callbackHandle = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) onFinishGuide();
    };

    return (
        <Joyride
            continuous
            callback={callbackHandle}
            disableCloseOnEsc
            disableOverlayClose
            disableScrolling
            floaterProps={{
                styles: {
                    arrow: {
                        length: 4,
                        spread: 8,
                    },
                },
            }}
            showSkipButton
            tooltipComponent={GuideTooltip}
            steps={steps}
            spotlightPadding={0}
            scrollToFirstStep
            styles={{
                options: {
                    arrowColor: 'var(--component-textIcon-normal-prominent)',
                },
            }}
            run={should_run}
        />
    );
};

export default React.memo(GuideContainer);
