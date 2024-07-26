import React, { ComponentProps } from 'react';
import { Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { Dropdown } from '@deriv-com/ui';
import './FormDropdown.scss';

type DropdownProps = Omit<ComponentProps<typeof Dropdown>, 'onSelect'>;

export type TFormDropdownProps = DropdownProps & {
    name: string;
    onSelect?: (selectedValue: string) => void;
    validationSchema?: Yup.AnySchema;
};

const FormDropdown = ({ disabled, name, onSelect, validationSchema, variant, ...rest }: TFormDropdownProps) => {
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
                const isFieldInvalid = Boolean(form.touched[name] && form.errors[name]);
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
                            onSearch={value => {
                                if (variant === 'prompt') {
                                    form.setFieldValue(name, value);
                                }
                                return field.onChange;
                            }}
                            onSelect={value => {
                                form.setFieldValue(name, value);
                                if (!form.touched[name]) {
                                    form.setFieldTouched(name);
                                }
                                if (onSelect) {
                                    onSelect(value as string);
                                }
                                return field.onChange;
                            }}
                            value={field.value}
                            variant={variant}
                        />
                    </div>
                );
            }}
        </Field>
    );
};
FormDropdown.displayName = 'FormDropdown';
export default FormDropdown;
