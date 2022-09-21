import classNames from 'classnames';
import React from 'react';

type TFieldProps = {
    className?: string;
    message: string;
    type?: 'error' | 'warn';
};

const Field = ({ message, className, type }: TFieldProps) => (
    <div
        className={classNames('dc-field', className, {
            'dc-field--error': type === 'error',
            'dc-field--warn': type === 'warn',
        })}
    >
        {message}
    </div>
);

export default Field;
