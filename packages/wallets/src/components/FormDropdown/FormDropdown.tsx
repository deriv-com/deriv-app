import React, { ComponentProps } from 'react';
import { Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { Dropdown } from '@deriv-com/ui';
import './FormDropdown.scss';

export type TFormDropdownProps = ComponentProps<typeof Dropdown> & {
    name: string;
    validationSchema?: Yup.AnySchema;
};

const FormDropdown = ({ disabled, isRequired, name, onSelect, validationSchema, ...rest }: TFormDropdownProps) => {
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
                const isFieldInvalid = Boolean(form.touched[name] && isRequired && form.errors[name]);
                return (
                    <div className='wallets-form-dropdown'>
                        <Dropdown
                            {...rest}
                            disabled={disabled}
                            errorMessage={isFieldInvalid ? (form.errors[name] as string) : ''}
                            name={name}
                            onBlur={() => {
                                if (!form.touched[name]) {
                                    form.setFieldTouched(name);
                                }
                            }}
                            onSelect={value => {
                                if (!form.touched[name]) {
                                    form.setFieldTouched(name);
                                }
                                onSelect(value as string);
                            }}
                            value={field.value}
                        />
                    </div>
                );
            }}
        </Field>
    );
};

FormDropdown.displayName = 'FormDropdown';
export default FormDropdown;
