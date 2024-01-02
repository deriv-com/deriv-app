import React from 'react';
import { Text } from '@deriv/quill-design';
import { StandaloneCheckBoldIcon } from '@deriv/quill-icons';
import StepConnector from './step-connector';

export type TStep = { title: string; isFilled: boolean };

type TStepperProps = {
    isActive: boolean;
    step: TStep;
    stepCount: number;
};

const Stepper = ({ isActive, step, stepCount }: TStepperProps) => (
    <div>
        <div>
            {stepCount !== 0 && <StepConnector isActive={isActive} />}
            <span>{step.isFilled ? <StandaloneCheckBoldIcon /> : null}</span>
        </div>
        <Text bold={isActive} size='sm'>
            {step.title}
        </Text>
    </div>
);

export default Stepper;
