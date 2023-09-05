import React from 'react';
import classNames from 'classnames';

type TProgressBarTracker = {
    step: number;
    steps_list: Array<string>;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    is_transition?: boolean;
};

const ProgressBarTracker = ({ step, steps_list, setStep, is_transition = false }: TProgressBarTracker) => (
    <div className='dc-progress-bar-tracker'>
        {steps_list.map((step_item, index) => {
            const active = step === index + 1;

            return (
                <div
                    key={step_item}
                    onClick={() => setStep(index + 1)}
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
