import React from 'react';
import { Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { WalletDropdown } from '../Base';
import type { TWalletDropdownProps } from '../Base/WalletDropdown/WalletDropdown';

export interface TFormDropdownProps extends TWalletDropdownProps {
    name: string;
    validationSchema?: Yup.AnySchema;
}

/**
 * This component is just a wrapper to the Field Formik component and WalletTextField
 * Use this component when you are using the FlowProvider with a form and several inputs,
 * and you want those input values to be tracked and validated
 */
const FormDropdown = ({ disabled, errorMessage, name, validationSchema, ...rest }: TFormDropdownProps) => {
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
            {({ field, form }: FieldProps) => {
                return (
                    <WalletDropdown
                        {...rest}
                        disabled={disabled}
                        errorMessage={form.touched[name] && (form.errors[name] || errorMessage)}
                        isRequired={form.touched[name] && (!!form.errors[name] || !!errorMessage)}
                        name={name}
                        onChange={field.onChange}
                        onFocus={() => {
                            form.setFieldTouched(name);
                        }}
                        value={field.value}
                    />
                );
            }}
        </Field>
    );
};

FormDropdown.displayName = 'FormDropdown';
export default FormDropdown;
