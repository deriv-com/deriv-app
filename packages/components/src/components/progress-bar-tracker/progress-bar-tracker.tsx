import React from 'react';
import classNames from 'classnames';

type TProgressBarTracker = {
    step: number;
    steps_list: Array<string>;
    onStepChange: (step_num: number) => void;
    is_transition?: boolean;
};

const ProgressBarTracker = ({ step, steps_list, is_transition = false, onStepChange }: TProgressBarTracker) => (
    <div className='dc-progress-bar-tracker'>
        {steps_list.map((step_item, index) => {
            const active = step === index + 1;

            const handleClick = () => {
                onStepChange(index + 1);
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

export default ProgressBarTracker;
