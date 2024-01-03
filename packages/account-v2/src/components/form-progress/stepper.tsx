import React from 'react';
import { Text, qtMerge } from '@deriv/quill-design';
import { StandaloneCheckBoldIcon } from '@deriv/quill-icons';
import StepConnector from './step-connector';

export type TStep = { title: string; isFilled: boolean };

type TStepperProps = {
    isActive: boolean;
    step: TStep;
    stepCount: number;
};

const desktopStyle = {
    stepper: 'lg:flex lg:w-fit lg:items-end lg:gap-800',
};

const Stepper = ({ isActive, step, stepCount }: TStepperProps) => (
    <div className={qtMerge('relative justify-center', desktopStyle.stepper)}>
        <div className='flex flex-col items-center'>
            {stepCount !== 0 && <StepConnector isActive={isActive} />}
            <span className='z-10 box-border flex h-800 w-800 items-center rounded-pill outline outline-2 outline-solid-grey-1'>
                {step.isFilled ? <StandaloneCheckBoldIcon /> : null}
            </span>
        </div>
        <Text bold={isActive} size='sm' className='relative top-100'>
            {step.title}
        </Text>
    </div>
);

export default Stepper;
