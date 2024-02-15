import React from 'react';
import { qtMerge } from '@deriv/quill-design';
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
    <div aria-current={isActive} className={qtMerge('group relative justify-center', desktopStyle.stepper)}>
        <div className='flex flex-col items-center'>
            {stepCount !== 0 && <StepConnector isActive={isActive} />}
            <span className={stepperVariants({ isActive, isFilled })}>
                {isFilled && <StandaloneCheckBoldIcon fill={isActive ? '#fff' : '#000'} />}
            </span>
        </div>
        <Text className='relative top-4' size='sm' weight={isActive ? 'bold' : 'normal'}>
            {step}
        </Text>
    </div>
);

export default Stepper;
