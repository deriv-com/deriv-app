import React from 'react';
import { FieldInputProps, FormikHelpers, FormikState, Field } from 'formik';
import { Input } from '@deriv/components';

type FormInputFieldProps = {
    name: string;
    optional?: boolean;
    warn?: string;
} & React.ComponentProps<typeof Input>;

type TFormInputFieldHelpers<T> = {
    field: FieldInputProps<string>;
    form: FormikHelpers<T> & FormikState<T>;
};

/**
 * FormInputField is a wrapper around Input that can be used with Formik.
 * @name FormInputField
 * @param name - Name of the field
 * @param [optional] - Whether the field is optional
 * @param [warn] - Display a warning message
 * @param [props] - Other props to pass to Input
 * @returns ReactNode
 */
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
