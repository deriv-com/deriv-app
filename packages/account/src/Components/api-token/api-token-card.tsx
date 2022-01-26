import * as React from 'react';
import { Field } from 'formik';
import { CompositeCheckbox } from '@deriv/components';

type ApiTokenCardProps = {
    description: string;
    display_name: string;
    name: string;
    value: unknown | string | boolean;
    setFieldValue: () => void;
};

const ApiTokenCard = ({ name, value, display_name, description, setFieldValue }: ApiTokenCardProps) => {
    return (
        <Field name={name}>
            {({ field }) => (
                <CompositeCheckbox
                    {...field}
                    onChange={() => setFieldValue(name, !value)}
                    value={value}
                    className='api-token__checkbox'
                    defaultChecked={value}
                    label={display_name}
                    description={description}
                />
            )}
        </Field>
    );
};

export default ApiTokenCard;
