import React from 'react';

import './progress-bar-onboarding.scss';

type TProgressBarOnboarding = {
    step: number;
    amount_of_steps: Array<string>;
    setStep: React.Dispatch<React.SetStateAction<number>>;
};

const ProgressBarOnboarding = ({ step, amount_of_steps, setStep }: TProgressBarOnboarding) => {
    return (
        <div className='progress-bar'>
            {amount_of_steps.map((st, index) => {
                const active = step === index + 1;

                return (
                    <div
                        key={st}
                        onClick={() => setStep(index + 1)}
                        className={active ? 'progress-bar-rectangle' : 'progress-bar-circle'}
                    />
                );
            })}
        </div>
    );
};

export default ProgressBarOnboarding;
