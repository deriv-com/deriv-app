import React from 'react';
import Stepper, { TStep } from './Stepper';

type TDesktopProgressBar = {
    activeStep: number;
    steps: TStep[];
};

/**
 * @name DesktopProgressBar
 * @param steps - List of steps to be rendered
 * @param activeStep - The current active step
 * @returns React Component
 */
const DesktopProgressBar = ({ activeStep, steps = [] }: TDesktopProgressBar) => {
    return (
        <div className='pl-100'>
            {steps.map((step, index) => (
                <Stepper isActive={index + 1 <= activeStep} key={step.title} step={step} stepCount={index} />
            ))}
        </div>
    );
};

export default DesktopProgressBar;
