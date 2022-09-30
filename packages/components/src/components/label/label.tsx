import classNames from 'classnames';
import React from 'react';

type TLabel = {
    mode:
        | 'adjustment'
        | 'default'
        | 'success'
        | 'warn'
        | 'danger'
        | 'info'
        | 'transfer'
        | 'default-invert'
        | 'success-invert'
        | 'warn-invert';
    size: 'regular' | 'large';
    className?: string;
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

const Label = ({ mode, children, size = 'regular', className }: React.PropsWithChildren<TLabel>) => {
    const type = available_modes.some((m: string) => m === mode) ? mode : 'default';
    const scale = available_sizes.some((s: string) => s === size) ? size : 'regular';

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
