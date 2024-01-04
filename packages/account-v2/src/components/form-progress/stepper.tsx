import React from 'react';
import { Text, qtMerge } from '@deriv/quill-design';
import { StandaloneCheckBoldIcon } from '@deriv/quill-icons';
import StepConnector from './step-connector';
import { stepperVariants, desktopStyle } from './form-progress.classnames';

export type TStep = { title: string; isFilled: boolean };

type TStepperProps = {
    isActive: boolean;
    step: TStep;
    stepCount: number;
    onClick: React.MouseEventHandler<HTMLSpanElement>; // [TODO]:Mock - remove once isActive comes from Modal
};

const Stepper = ({ isActive, step, stepCount, onClick }: TStepperProps) => (
    <div className={qtMerge('group relative justify-center', desktopStyle.stepper)} aria-current={isActive}>
        <div className='flex flex-col items-center'>
            {stepCount !== 0 && <StepConnector isActive={isActive} />}
            <span className={stepperVariants({ isActive, isFilled: step.isFilled })}>
                {step.isFilled ? <StandaloneCheckBoldIcon fill={isActive ? '#fff' : '#000'} /> : null}
            </span>
        </div>
        <Text bold={isActive} size='sm' className='relative top-200' onClick={onClick}>
            {step.title}
        </Text>
    </div>
);

export default Stepper;
