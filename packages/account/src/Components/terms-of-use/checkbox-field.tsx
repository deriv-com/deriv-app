import React from 'react';
import { Checkbox } from '@deriv/components';

/*
 * This component is used with Formik's Field component.
 */
type TCheckBoxField = {
    field: {
        name: string;
        value: string;
        onChange: () => any;
    };
    id: string;
    label: string;
    className: string;
};

const CheckboxField = ({ field: { name, value, onChange }, id, label, className, ...props }: TCheckBoxField) => {
    return (
        <div className={className}>
            <Checkbox value={value} name={name} label={label} onChange={onChange} {...props} />
        </div>
    );
};

export default CheckboxField;
