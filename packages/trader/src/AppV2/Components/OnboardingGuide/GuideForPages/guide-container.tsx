import React from 'react';
import Joyride, { ACTIONS, CallBackProps, STATUS } from 'react-joyride';
import GuideTooltip from './guide-tooltip';
import STEPS from './steps-config';

type TGuideContainerProps = {
    should_run: boolean;
    steps: CallBackProps['step'][];
    callback?: () => void;
};

type TFinishedStatuses = CallBackProps['status'][];

const GuideContainer = ({ should_run, steps, callback }: TGuideContainerProps) => {
    const [step_index, setStepIndex] = React.useState(0);

    const callbackHandle = (data: CallBackProps) => {
        const { status, action } = data;
        const finished_statuses: TFinishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finished_statuses.includes(status) || action === ACTIONS.CLOSE) callback?.();
    };

    return (
        <Joyride
            callback={callbackHandle}
            disableCloseOnEsc
            disableScrolling
            floaterProps={{
                styles: {
                    arrow: {
                        length: 4,
                        spread: 8,
                    },
                },
            }}
            run={should_run}
            steps={steps}
            spotlightPadding={0}
            styles={{
                options: {
                    arrowColor: 'var(--component-textIcon-normal-prominent)',
                    overlayColor: 'var(--core-color-opacity-black-600)',
                    zIndex: 1000,
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
