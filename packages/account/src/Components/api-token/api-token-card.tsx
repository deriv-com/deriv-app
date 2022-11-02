import React from 'react';
import { Field, FieldProps } from 'formik';
import { CompositeCheckbox } from '@deriv/components';

type TApiTokenCard = {
    children?: React.ReactNode;
    description: string;
    display_name: string;
    name: string;
    value: string | boolean;
    setFieldValue: (name: string, value: boolean) => void;
};

const ApiTokenCard = ({ name, value, display_name, description, setFieldValue, children }: TApiTokenCard) => {
    return (
        <Field name={name}>
            {({ field }: FieldProps<string | boolean>) => {
                return (
                    <CompositeCheckbox
                        {...field}
                        onChange={() => setFieldValue(name, !value)}
                        value={value}
                        className='api-token__checkbox'
                        defaultChecked={value}
                        label={display_name}
                        description={description}
                    >
                        {children}
                    </CompositeCheckbox>
                );
            }}
        </Field>
    );
};

export default ApiTokenCard;
