import React, { ComponentProps } from 'react';
import { Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { WalletTextField as TextField } from '../base/WalletTextField';

type FormInputFieldProps = Omit<ComponentProps<typeof TextField>, 'errorMessage' | 'isInvalid' | 'showMessage'> & {
    name: string;
    validationSchema?: Yup.AnySchema;
};

/**
 * FormInputField is a wrapper around Input that can be used with Formik.
 * @name FormInputField
 * @param name - Name of the field
 * @param [validationSchema] - Yup validation schema to use for the field
 * @param [props] - Other props to pass to Input
 * @returns ReactNode
 */
const FormInputField = ({ name, validationSchema, ...rest }: FormInputFieldProps) => {
    const validateField = (value: unknown) => {
        try {
            if (validationSchema) {
                validationSchema.validateSync(value);
            }
        } catch (err: unknown) {
            return (err as Yup.ValidationError).message;
        }
    };

    return (
        <Field name={name} validate={validateField}>
            {({ field, meta: { error, touched } }: FieldProps<string>) => (
                <TextField
                    {...field}
                    {...rest}
                    autoComplete='off'
                    errorMessage={touched && error}
                    isInvalid={touched && !!error}
                    showMessage
                    type='text'
                />
            )}
        </Field>
    );
};

export default FormInputField;
