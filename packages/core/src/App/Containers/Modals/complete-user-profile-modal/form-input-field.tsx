import React from 'react';
import { Field, FieldInputProps, FormikHelpers, FormikState } from 'formik';

import { Input } from '@deriv/components';

type FormInputFieldProps = {
    name: string;
    warn?: string;
} & React.ComponentProps<typeof Input>;

type TFormInputFieldHelpers<T> = {
    field: FieldInputProps<string>;
    form: FormikHelpers<T> & FormikState<T>;
};

const FormInputField = ({ name, warn, ...rest }: FormInputFieldProps) => (
    <Field name={name}>
        {({ field, form: { errors, touched, setFieldTouched } }: TFormInputFieldHelpers<Record<string, string>>) => {
            return (
                <Input
                    {...field}
                    {...rest}
                    type='text'
                    autoComplete='off'
                    error={touched[field.name] && errors[field.name] ? errors[field.name] : undefined}
                    warn={warn}
                    onChange={
                        rest.onChange ||
                        ((e: React.ChangeEvent<HTMLInputElement>) => {
                            !touched[field.name] && setFieldTouched(field.name);
                            field.onChange(e);
                        })
                    }
                />
            );
        }}
    </Field>
);

export default FormInputField;
