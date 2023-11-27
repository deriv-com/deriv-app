import React from 'react';
import classNames from 'classnames';

const StepConnectorLine = ({ is_active }: { is_active: boolean }) => (
    <span className={classNames('stepper__line', { 'stepper__line--active': is_active })} />
);

export default StepConnectorLine;
