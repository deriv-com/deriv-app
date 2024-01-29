import React, { Fragment } from 'react';
import { useBreakpoint } from '@deriv/quill-design';
import StepConnector from './StepConnector';
import Stepper, { TStep } from './Timeline';

type TFormProgressProps = {
    activeStep: number;
    steps: TStep[]; // [TODO]:Mock - Enable once isActive comes from Modal
};

/**
 * @name FormProgress
 * @param steps - List of steps to be rendered
 * @returns React Component
 */
export const Timeline = ({ activeStep, steps = [] }: TFormProgressProps) => {
    const { isMobile } = useBreakpoint();

    return (
        <Fragment>
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
        </Fragment>
    );
};
