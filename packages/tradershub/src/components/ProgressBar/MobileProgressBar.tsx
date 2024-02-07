import React from 'react';
import { StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import StepConnector from './StepConnector';
import { TStep } from './Stepper';

type TMobileProgressBar = {
    activeStep: number;
    steps: TStep[];
};

/**
 * @name MobileProgressBar
 * @param steps - List of steps to be rendered
 * @param activeStep - The current active step
 * @returns React Component
 */
const MobileProgressBar = ({ activeStep, steps = [] }: TMobileProgressBar) => {
    return (
        <div>
            <div className='flex items-center justify-between p-800'>
                <div>
                    <Text size='md' weight='bold'>
                        Step 3/4:
                    </Text>{' '}
                    <Text size='md'>Address</Text>
                </div>
                <StandaloneXmarkBoldIcon className='cursor-pointer ' />
            </div>
            <div className='grid grid-flow-col gap-gap-2xs'>
                {steps.map((step, index) => (
                    <StepConnector isActive={index + 1 <= activeStep} key={step.title} />
                ))}
            </div>
        </div>
    );
};

export default MobileProgressBar;
