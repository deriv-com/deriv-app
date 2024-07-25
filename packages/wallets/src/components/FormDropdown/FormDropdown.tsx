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
                            onSearch={value => {
                                form.setFieldValue(name, value);
                            }}
                            onSelect={value => {
                                if (onSelect) {
                                    onSelect(value as string);
                                } else {
                                    form.setFieldValue(name, value);
                                }
                                field.onChange(value);
                                if (!form.touched[name]) {
                                    form.setFieldTouched(name);
                                }
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
