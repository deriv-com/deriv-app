import React from 'react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import GuideTooltip from './guide-tooltip';
import STEPS from './steps-config';

type TGuideContainerProps = {
    should_run: boolean;
    onFinishGuide: () => void;
};

type TFinishedStatuses = CallBackProps['status'][];

const GuideContainer = ({ should_run, onFinishGuide }: TGuideContainerProps) => {
    const [step_index, setStepIndex] = React.useState(0);

    const callbackHandle = (data: CallBackProps) => {
        const { status, step, index } = data;
        if (index === 0) {
            step.disableBeacon = true;
        }
        const finished_statuses: TFinishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finished_statuses.includes(status)) onFinishGuide();
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
            steps={STEPS}
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
