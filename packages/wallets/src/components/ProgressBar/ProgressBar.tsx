import React from 'react';
import './ProgressBar.scss';

type TProps = {
    step: number;
    amount_of_steps: Array<string>;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    is_transition?: boolean;
};

const ProgressBarOnboarding: React.FC<TProps> = ({ step, amount_of_steps, setStep, is_transition }) => {
    return (
        <div className='wallets-progress-bar'>
            {amount_of_steps.map((st, index) => {
                const active = step === index + 1;

                const barClassName = active ? 'wallets-progress-bar-active' : 'wallets-progress-bar-inactive';

                return (
                    <div
                        key={st}
                        onClick={() => setStep(index + 1)}
                        className={`${barClassName} ${is_transition ? 'wallets-progress-bar-transition' : ''}`}
                    />
                );
            })}
        </div>
    );
};

export default ProgressBarOnboarding;
