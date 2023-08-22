import React from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import { CompositeCheckbox } from '@deriv/components';

type TApiTokenCard = {
    description: string;
    display_name: string;
    name: string;
    value: boolean;
};

const ApiTokenCard = ({ name, value, display_name, description, children }: React.PropsWithChildren<TApiTokenCard>) => {
    const { setFieldValue } = useFormikContext();
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
