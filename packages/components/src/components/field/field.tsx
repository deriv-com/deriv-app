import classNames from 'classnames';
import React from 'react';

type FieldProps = {
    className: string;
    message: unknown | string | boolean;
    type: string;
};

const Field = ({ message, className, type }: FieldProps) => (
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
