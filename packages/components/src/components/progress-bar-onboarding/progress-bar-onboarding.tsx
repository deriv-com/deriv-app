import React from 'react';
import './progress-bar-onboarding.scss';
import classNames from 'classnames';

type TProgressBarOnboarding = {
    step: number;
    amount_of_steps: Array<string>;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    is_transition?: boolean;
};

const ProgressBarOnboarding = ({ step, amount_of_steps, setStep, is_transition }: TProgressBarOnboarding) => {
    return (
        <div className='progress-bar'>
            {amount_of_steps.map((st, index) => {
                const active = step === index + 1;

                return (
                    <div
                        key={st}
                        onClick={() => setStep(index + 1)}
                        className={classNames({
                            'progress-bar-rectangle': active,
                            'progress-bar-circle': !active,
                            'progress-bar-transition': is_transition,
                        })}
                    />
                );
            })}
        </div>
    );
};

export default ProgressBarOnboarding;
