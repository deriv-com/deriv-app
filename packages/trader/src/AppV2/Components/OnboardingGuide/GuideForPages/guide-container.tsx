import React from 'react';
import Joyride, { ACTIONS, CallBackProps, STATUS } from 'react-joyride';
import GuideTooltip from './guide-tooltip';
import STEPS from './steps-config';

type TGuideContainerProps = {
    should_run: boolean;
    onFinishGuide: () => void;
};

type TFinishedStatuses = CallBackProps['status'][];

const GuideContainer = ({ onFinishGuide }: TGuideContainerProps) => {
    const [step_index, setStepIndex] = React.useState(0);
    const [should_run, setShouldRun] = React.useState(false);

    React.useEffect(() => {
        // check local storage before doing this
        const observer = new MutationObserver(() => {
            if (document.getElementsByClassName('trade__parameter-tooltip-info').length > 0) {
                setTimeout(() => {
                    setShouldRun(true);
                }, 400);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }, []);

    const callbackHandle = (data: CallBackProps) => {
        const { status, step, index, action, origin } = data;

        // if user closes the guide, set should_run to false and this flag to local storage
        if (action === ACTIONS.CLOSE) {
            setShouldRun(false);
        }

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
            disableOverlayClose={false}
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
                    zIndex: 200,
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
