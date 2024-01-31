import React, { Fragment } from 'react';
import { useBreakpoint } from '@deriv/quill-design';
import StepConnector from './StepConnector';
import Stepper, { TStep } from './Stepper';

type TFormProgressProps = {
    activeStep: number;
    steps: TStep[];
};

/**
 * @name FormProgress
 * @param steps - List of steps to be rendered
 * @returns React Component
 */
export const ProgressBar = ({ activeStep, steps = [] }: TFormProgressProps) => {
    const { isMobile } = useBreakpoint();

    return (
        <div className='pl-100'>
            {isMobile ? (
                <div className='grid grid-flow-col gap-gap-2xs'>
                    {steps.map((step, index) => (
                        <StepConnector isActive={index + 1 <= activeStep} key={step.title} />
                    ))}
                </div>
            ) : (
                <Fragment>
                    {steps.map((step, index) => (
                        <Stepper isActive={index + 1 <= activeStep} key={step.title} step={step} stepCount={index} />
                    ))}
                </Fragment>
            )}
        </div>
    );
};
