import classNames from 'classnames';
import React from 'react';

type LabelProps = {
    children: React.ReactNode;
    mode: unknown;
};

const available_modes = [
    'adjustment',
    'default',
    'success',
    'warn',
    'danger',
    'info',
    'transfer',
    'default-invert',
    'success-invert',
    'warn-invert',
];

const available_sizes = ['regular', 'large'];

const Label = ({ mode, children, size = 'regular', className }: LabelProps) => {
    const type = available_modes.some(m => m === mode) ? mode : 'default';
    const scale = available_sizes.some(s => s === size) ? size : 'regular';

    return (
        <span
            className={classNames('dc-label', className, {
                [`dc-label--general--${scale}`]: scale,
                [`dc-label--general--${type}`]: type,
            })}
        >
            {children}
        </span>
    );
};

export default Label;
