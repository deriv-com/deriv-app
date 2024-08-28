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
            content: <Localize i18n_default_text='Scroll left or right to explore trade types.' />,
            disableBeacon: true,
            offset: 0,
            spotlightPadding: 2,
            target: '.trade__trade-types',
            title: <Localize i18n_default_text='Explore trade types (1/6)' />,
        },
        {
            content: <Localize i18n_default_text='View available markets here.' />,
            disableBeacon: true,
            offset: 4,
            placement: 'bottom-start' as Step['placement'],
            spotlightPadding: 8,
            target: '.market-selector__container',
            title: <Localize i18n_default_text='Choose a market (2/6)' />,
        },
        {
            content: <Localize i18n_default_text='Specify your trade parameters.' />,
            disableBeacon: true,
            offset: 4,
            spotlightPadding: 8,
            target: '.trade-params',
            title: <Localize i18n_default_text='Open your trade (3/6)' />,
        },
        {
            content: <Localize i18n_default_text='Scroll left or right to adjust your trade parameters.' />,
            disableBeacon: true,
            // TODO: remove disableScrolling after 4 step wil be added
            disableScrolling: false,
            offset: -4,
            target: '.trade__bottom',
            title: <Localize i18n_default_text='Make quick adjustments (5/6)' />,
        },
        {
            content: <Localize i18n_default_text='View your positions here.' />,
            disableBeacon: true,
            offset: -4,
            // TODO: change selector to a className when Vinu's changes of Bottom Nav will be merged
            target: '.user__guide__anchor',
            title: <Localize i18n_default_text='Check your positions (6/6)' />,
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
                    overlayColor: 'var(--core-color-opacity-black-600)',
                },
                spotlight: {
                    borderRadius: 'unset',
                },
            }}
            run={should_run}
        />
    );
};

export default React.memo(GuideContainer);
