import React from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { Localize } from '@deriv/translations';
import GuideTooltip from './guide-tooltip';

type TGuideContainerProps = {
    should_run: boolean;
    onFinishGuide: () => void;
};

const GuideContainer = ({ should_run, onFinishGuide }: TGuideContainerProps) => {
    const [step_index, setStepIndex] = React.useState(0);
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
            content: '',
            disableBeacon: false,
            offset: 0,
            spotlightPadding: 0,
            styles: {
                spotlight: {
                    display: 'none',
                },
                arrow: {
                    display: 'none',
                },
            },
            target: '.purchase-button__wrapper',
            title: 'scroll-icon',
        },
        {
            content: <Localize i18n_default_text='Track market trends with our interactive charts.' />,
            disableBeacon: true,
            spotlightPadding: 8,
            offset: 4,
            target: '.trade__chart-tooltip',
            title: <Localize i18n_default_text='Analyse with charts (4/6)' />,
            placement: 'bottom' as Step['placement'],
        },
        {
            content: <Localize i18n_default_text='Scroll left or right to adjust your trade parameters.' />,
            disableBeacon: true,
            disableScrolling: false,
            offset: -4,
            target: '.trade__parameter',
            title: <Localize i18n_default_text='Make quick adjustments (5/6)' />,
        },
        {
            content: <Localize i18n_default_text='View your positions here.' />,
            disableBeacon: true,
            offset: -4,
            target: '.user-guide__anchor',
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
                        display: step_index === 3 ? 'none' : 'inline-flex',
                    },
                },
            }}
            run={should_run}
            showSkipButton
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
            stepIndex={step_index}
            tooltipComponent={props => <GuideTooltip {...props} setStepIndex={setStepIndex} />}
        />
    );
};

export default React.memo(GuideContainer);
