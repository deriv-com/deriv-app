import React from 'react';
import classNames from 'classnames';
import { useTradersHubTracking } from '../../hooks';

type TProgressBarTracker = {
    step: number;
    steps_list: Array<string>;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    is_transition?: boolean;
};

const ProgressBarTracker = ({ step, steps_list, setStep, is_transition = false }: TProgressBarTracker) => {
    const { trackDotNavigation } = useTradersHubTracking();

    return (
        <div className='dc-progress-bar-tracker'>
            {steps_list.map((step_item, index) => {
                const active = step === index + 1;

                const handleClick = () => {
                    trackDotNavigation(index + 1);
                    setStep(index + 1);
                };

                return (
                    <div
                        key={step_item}
                        onClick={handleClick}
                        className={classNames({
                            'dc-progress-bar-tracker-rectangle': active,
                            'dc-progress-bar-tracker-circle': !active,
                            'dc-progress-bar-tracker-transition': is_transition,
                        })}
                    />
                );
            })}
        </div>
    );
};

export default ProgressBarTracker;
