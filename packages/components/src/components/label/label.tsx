import classNames from 'classnames';
import React from 'react';

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
] as const;

const available_sizes = ['regular', 'large'] as const;

type TLabel = {
    mode: typeof available_modes[number];
    size?: typeof available_sizes[number];
    className?: string;
};

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
