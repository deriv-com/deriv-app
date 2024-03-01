import React from 'react';
import { twMerge } from 'tailwind-merge';
import { StandaloneCheckBoldIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { desktopStyle, stepperVariants } from './ProgressBar.classnames';
import StepConnector from './StepConnector';

export type TSteps = string[];

type TStepperProps = {
    isActive: boolean;
    isFilled?: boolean;
    step: TSteps[number];
    stepCount: number;
};

const Stepper = ({ isActive, isFilled = false, step, stepCount }: TStepperProps) => (
    <div aria-current={isActive} className={twMerge('relative items-center', desktopStyle.stepper)}>
        <div className='flex flex-col items-center self-center'>
            {stepCount !== 0 && <StepConnector isActive={isActive} />}
            <span className={stepperVariants({ isActive, isFilled })}>
                {isFilled && <StandaloneCheckBoldIcon className={isActive ? 'fill-white' : 'fill-black'} />}
            </span>
        </div>
        <Text as='p' size='sm' weight={isActive ? 'bold' : 'normal'}>
            {step}
        </Text>
    </div>
);

export default Stepper;
