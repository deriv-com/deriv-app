import React from 'react';
import classNames from 'classnames';

/**
 * Creates a line between steps
 * @name StepConnectorLine
 * @param is_active - Whether the step connecting the line is active
 * @returns React Component
 */
const StepConnectorLine = ({ is_active }: { is_active: boolean }) => (
    <span className={classNames('stepper__line', { 'stepper__line--active': is_active })} />
);

export default StepConnectorLine;
