import React from 'react';
import { Text, qtMerge } from '@deriv/quill-design';
import { StandaloneCheckBoldIcon } from '@deriv/quill-icons';
import StepConnector from './step-connector';
import { stepperVariants } from './form-progress.classnames';

export type TStep = { title: string; isFilled: boolean };

type TStepperProps = {
    isActive: boolean;
    step: TStep;
    stepCount: number;
    onClick: any;
};

const desktopStyle = {
    stepper: 'lg:flex lg:w-fit lg:items-end lg:gap-800',
};

const Stepper = ({ isActive, step, stepCount, onClick }: TStepperProps) => (
    <div className={qtMerge('group relative justify-center', desktopStyle.stepper)} aria-current={isActive}>
        <div className='flex flex-col items-center'>
            {stepCount !== 0 && <StepConnector isActive={isActive} />}
            {/* <span className='z-10 box-border flex h-800 w-800 items-center rounded-pill outline outline-2 outline-solid-grey-1 group-aria-[current=true]:outline-solid-coral-700 group-aria-[current=true]:transition-all group-aria-[current=true]:delay-700 group-aria-[current=true]:duration-700 group-aria-[current=true]:ease-out'>
                {step.isFilled ? <StandaloneCheckBoldIcon /> : null}
            </span> */}
            <span className={stepperVariants({ isActive })}>{step.isFilled ? <StandaloneCheckBoldIcon /> : null}</span>
        </div>
        <Text bold={isActive} size='sm' className='relative top-100' onClick={onClick}>
            {step.title}
        </Text>
    </div>
);

export default Stepper;
