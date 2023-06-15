import React from 'react';
import './progress-bar-onboarding.scss';

type TProgressBarOnboarding = {
    step: number;
    amount_of_steps: Array<string>;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    is_transition?: boolean;
};

const ProgressBarOnboarding = ({ step, amount_of_steps, setStep, is_transition }: TProgressBarOnboarding) => {
    const transition_class = is_transition ? 'progress-bar-transition' : '';

    return (
        <div className='progress-bar'>
            {amount_of_steps.map((st, index) => {
                const active = step === index + 1;

                return (
                    <div
                        key={st}
                        onClick={() => setStep(index + 1)}
                        className={
                            active
                                ? `progress-bar-rectangle ${transition_class}`
                                : `progress-bar-circle ${transition_class}`
                        }
                    />
                );
            })}
        </div>
    );
};

export default ProgressBarOnboarding;
