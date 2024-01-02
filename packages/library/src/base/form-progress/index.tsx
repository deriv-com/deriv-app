import React from 'react';
import { useDevice } from '../../hooks';
import Stepper, { TStep } from './stepper';
import StepConnector from './step-connector';

type TFormProgressProps = {
    steps: Array<TStep>;
    activeStep: number;
};

/**
 * @name FormProgress
 * @param steps - List of steps to be rendered
 * @returns React Component
 */
export const FormProgress = ({ activeStep, steps = [] }: TFormProgressProps) => {
    // const [activeStep, setActiveStep] = React.useState(0);

    const { isMobile } = useDevice();

    // const updateStep = (index: number) => {
    //     if (steps[index - 1]?.isFilled || index === 0) {
    //         setActiveStep(index);
    //     }
    // };

    return (
        <React.Fragment>
            {isMobile ? (
                <div>
                    {steps.map((step, index) => (
                        <StepConnector isActive={index <= activeStep} key={step.title} />
                    ))}
                </div>
            ) : (
                <React.Fragment>
                    {steps.map((step, index) => (
                        <Stepper key={step.title} step={step} stepCount={index} isActive={index <= activeStep} />
                    ))}
                </React.Fragment>
            )}
        </React.Fragment>
    );
};
