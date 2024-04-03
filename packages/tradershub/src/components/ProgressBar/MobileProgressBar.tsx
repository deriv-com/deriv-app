import React from 'react';
import { StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import StepConnector from './StepConnector';
import { TSteps } from './Stepper';

type TMobileProgressBar = {
    activeStep: number;
    onClickClose: VoidFunction;
    steps: TSteps;
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
            <div className='flex items-center justify-between px-16 bg-system-light-secondary-background py-14'>
                <div>
                    <Text weight='bold'>
                        Step {activeStep}/{steps.length}:
                    </Text>{' '}
                    <Text>{steps[activeStep - 1]}</Text>
                </div>
                <StandaloneXmarkBoldIcon className='cursor-pointer' onClick={onClickClose} />
            </div>
            <div className='grid grid-flow-col gap-2'>
                {steps.map((step, index) => (
                    <StepConnector isActive={index + 1 <= activeStep} key={step} />
                ))}
            </div>
        </div>
    );
};

export default MobileProgressBar;
