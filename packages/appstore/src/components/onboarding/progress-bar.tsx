import React from 'react';

import './progress-bar.scss';

type TProgressBar = {
    step: number;
    amount_of_steps: Array<string>;
    setStep: React.Dispatch<React.SetStateAction<number>>;
};

const ProgressBar = ({ step, amount_of_steps, setStep }: TProgressBar) => {
    return (
        <div className='progress-bar'>
            {amount_of_steps.map((_, index) => {
                const active = step === index + 1;

                return (
                    <div
                        key={index}
                        onClick={() => setStep(index + 1)}
                        className={active ? 'progress-bar-rectangle' : 'progress-bar-circle'}
                    />
                );
            })}
        </div>
    );
};

export default ProgressBar;
