import React from 'react';
import Stepper, { TSteps } from './Stepper';

type TDesktopProgressBar = {
    activeStep: number;
    steps: TSteps;
};

/**
 * @name DesktopProgressBar
 * @param steps - List of steps to be rendered
 * @param activeStep - The current active step
 * @returns React Component
 */
const DesktopProgressBar = ({ activeStep, steps = [] }: TDesktopProgressBar) => {
    return (
        <div className='pl-2'>
            {steps.map((step, index) => (
                <Stepper
                    isActive={index + 1 <= activeStep}
                    isFilled={index + 2 <= activeStep}
                    key={step}
                    step={step}
                    stepCount={index}
                />
            ))}
        </div>
    );
};

export default DesktopProgressBar;
