import React, { useState } from 'react';
import { useBreakpoint } from '@deriv/quill-design';
import StepConnector from './step-connector';
import Stepper, { TStep } from './stepper';

type TFormProgressProps = {
    activeStep: number;
    steps: TStep[]; // [TODO]:Mock - Enable once isActive comes from Modal
};

/**
 * @name FormProgress
 * @param steps - List of steps to be rendered
 * @returns React Component
 */
export const FormProgress = ({ steps = [] }: TFormProgressProps) => {
    const [activeStep, setActiveStep] = useState(0); // [TODO]:Mock - remove once isActive comes from Modal

    const { isMobile } = useBreakpoint();

    // [TODO]:Mock - remove once isActive comes from Modal
    const updateStep = (index: number) => {
        if (steps[index - 1]?.isFilled || index === 0) {
            setActiveStep(index + 1);
        }
    };

    return (
        <React.Fragment>
            {isMobile ? (
                <React.Fragment>
                    {' '}
                    {/* [TODO]:Mock - remove Fragment once isActive comes from Modal*/}
                    <div className='grid grid-flow-col gap-gap-2xs'>
                        {steps.map((step, index) => (
                            <StepConnector isActive={index <= activeStep} key={step.title} />
                        ))}
                    </div>
                    {/* [TODO]:Mock - remove button once isActive comes from Modal*/}
                    <button
                        onClick={() => {
                            updateStep(activeStep);
                        }}
                    >
                        Update
                    </button>
                    {/* [TODO]:Mock - remove Fragment once isActive comes from Modal*/}
                </React.Fragment>
            ) : (
                <React.Fragment>
                    {steps.map((step, index) => (
                        <Stepper
                            isActive={index <= activeStep}
                            key={step.title}
                            onClick={() => {
                                if (steps[index - 1]?.isFilled || index === 0) setActiveStep(index);
                            }}
                            step={step}
                            stepCount={index}
                        />
                    ))}
                </React.Fragment>
            )}
        </React.Fragment>
    );
};
