import React from 'react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import GuideTooltip from './guide-tooltip';
import STEPS from './steps-config';
import { useSwipeable } from 'react-swipeable';

type TGuideContainerProps = {
    should_run: boolean;
    onFinishGuide: () => void;
};

type TFinishedStatuses = CallBackProps['status'][];

const GuideContainer = ({ should_run, onFinishGuide }: TGuideContainerProps) => {
    const [step_index, setStepIndex] = React.useState(0);

    const callbackHandle = (data: CallBackProps) => {
        const { status } = data;
        const finished_statuses: TFinishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finished_statuses.includes(status)) onFinishGuide();
    };

    const swipe_handlers = useSwipeable({
        onSwipedUp: () => {
            if (STEPS[step_index].title === 'scroll-icon') {
                document.querySelector('.trade__chart')?.scrollIntoView();
                setStepIndex((prev: number) => prev + 1);
            }
        },
        preventDefaultTouchmoveEvent: true,
        trackTouch: true,
        trackMouse: true,
    });

    return (
        <div {...swipe_handlers}>
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
        </div>
    );
};

export default React.memo(GuideContainer);
