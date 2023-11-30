import React from 'react';
import classNames from 'classnames';
import Icon from '../icon';
import StepConnectorLine from './step-connector-line';
import Text from '../text';

export type TStep = { title: string; is_filled: boolean };

type TStepperProps = {
    is_active: boolean;
    step: TStep;
    step_count: number;
    onClick: (index: number) => void;
};
/**
 * Renders a step in the form progress
 * @name Stepper
 * @param is_active - Whether the step is active
 * @param step - The step object
 * @param step_count - The index of the step
 * @param onClick - Function to be called when the step is clicked
 * @returns React Component
 */
const Stepper = ({ is_active, step, step_count, onClick }: TStepperProps) => (
    <div className='stepper__layout'>
        <div className='bullet__layout'>
            {step_count !== 0 && <StepConnectorLine is_active={is_active} />}
            <span
                className={classNames('stepper__bullet', {
                    'stepper__bullet--active': is_active,
                    'stepper__bullet--filled': step.is_filled && is_active,
                })}
            >
                {step.is_filled ? <Icon icon='IcCheckmarkBold' color='active' /> : null}
            </span>
        </div>
        <Text as='p' size='xs' weight={is_active ? 'bold' : 'unset'} onClick={onClick}>
            {step.title}
        </Text>
    </div>
);

export default Stepper;
