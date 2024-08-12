import { PropsWithChildren } from 'react';
import { Field, FieldProps } from 'formik';
import { CompositeCheckbox } from '@deriv/components';

type TApiTokenCard = {
    description: JSX.Element;
    display_name: JSX.Element;
    name: string;
};

const ApiTokenCard = ({ name, display_name, description, children }: PropsWithChildren<TApiTokenCard>) => {
    return (
        <Field name={name}>
            {({ field, form: { setFieldValue } }: FieldProps<boolean>) => (
                <CompositeCheckbox
                    {...field}
                    // Used to set the checkbox value when clicked on the encased region
                    onChange={() => setFieldValue(name, !field.value)}
                    className='api-token__checkbox'
                    label={display_name}
                    description={description}
                >
                    {children}
                </CompositeCheckbox>
            )}
        </Field>
    );
};

export default ApiTokenCard;
