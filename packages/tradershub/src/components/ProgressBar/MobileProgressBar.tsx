import React from 'react';
import { StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import StepConnector from './StepConnector';
import { TStep } from './Stepper';

type TMobileProgressBar = {
    activeStep: number;
    onClickClose?: VoidFunction;
    steps: TStep[];
};

/**
 * @name MobileProgressBar
 * @param steps - List of steps to be rendered
 * @param activeStep - The current active step
 * @param onClickClose - Function to close the modal
 * @returns React Component
 */
const MobileProgressBar = ({ activeStep, onClickClose, steps = [] }: TMobileProgressBar) => {
    return (
        <div>
            <div className='flex items-center justify-between px-800 py-700'>
                <div>
                    <Text weight='bold'>
                        Step {activeStep}/{steps.length}:
                    </Text>{' '}
                    <Text>{steps[activeStep - 1].title}</Text>
                </div>
                <StandaloneXmarkBoldIcon className='cursor-pointer' onClick={onClickClose} />
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
