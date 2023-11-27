import React from 'react';
import classNames from 'classnames';
import Icon from '../icon';
import StepConnectorLine from './step-connector-line';
import Text from '../text';

const Stepper = ({ is_active, step, step_count, total_steps }) => {
    return (
        <div className=''>
            {step_count !== 0 && <StepConnectorLine is_active={is_active} />}
            <div>
                <span className={classNames('stepper__bullet', { 'stepper__bullet--active': is_active })}>
                    {step.is_filled ? <Icon icon='IcCheckmarkBold' color='active' /> : null}
                </span>
                <Text
                    as='p'
                    align='center'
                    size='xxs'
                    weight={is_active ? 'bold' : 'unset'}
                    color={is_active ? 'loss-danger' : 'prominent'}
                >
                    {step.header.title}
                </Text>
            </div>
            {step_count !== total_steps && <StepConnectorLine is_active={is_active} />}
        </div>
    );
};

export default Stepper;
