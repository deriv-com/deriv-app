import React from 'react';
import { qtMerge, Text } from '@deriv/quill-design';
import { StandaloneCheckBoldIcon } from '@deriv/quill-icons';
import { desktopStyle, stepperVariants } from './form-progress.classnames';
import StepConnector from './step-connector';

export type TStep = { isFilled: boolean; title: string };

type TStepperProps = {
    isActive: boolean;
    onClick: React.MouseEventHandler<HTMLSpanElement>;
    step: TStep;
    stepCount: number; // [TODO]:Mock - remove once isActive comes from Modal
};

const Stepper = ({ isActive, onClick, step, stepCount }: TStepperProps) => (
    <div aria-current={isActive} className={qtMerge('group relative justify-center', desktopStyle.stepper)}>
        <div className='flex flex-col items-center'>
            {stepCount !== 0 && <StepConnector isActive={isActive} />}
            <span className={stepperVariants({ isActive, isFilled: step.isFilled })}>
                {step.isFilled ? <StandaloneCheckBoldIcon fill={isActive ? '#fff' : '#000'} /> : null}
            </span>
        </div>
        <Text bold={isActive} className='relative top-200' onClick={onClick} size='sm'>
            {step.title}
        </Text>
    </div>
);

export default Stepper;
