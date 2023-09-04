import React from 'react';

type TProgressBarTracker = {
    step: number;
    steps_list: Array<string>;
    setStep: React.Dispatch<React.SetStateAction<number>>;
};

const ProgressBarTracker = ({ step, steps_list, setStep }: TProgressBarTracker) => (
    <div className='dc-progress-bar-tracker'>
        {steps_list.map((step_item, index) => {
            const active = step === index + 1;

            return (
                <div
                    key={step_item}
                    onClick={() => setStep(index + 1)}
                    className={active ? 'dc-progress-bar-tracker-rectangle' : 'dc-progress-bar-tracker-circle'}
                />
            );
        })}
    </div>
);

export default ProgressBarTracker;
