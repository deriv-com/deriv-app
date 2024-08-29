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

const FormDropdown = ({
    disabled,
    list,
    name,
    onSearch,
    onSelect,
    validationSchema,
    variant,
    ...rest
}: TFormDropdownProps) => {
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
                const isFieldInvalid = Boolean((form.touched[name] || field.value) && form.errors[name]);
                return (
                    <div className='wallets-form-dropdown'>
                        <Dropdown
                            {...rest}
                            disabled={disabled}
                            emptyResultMessage='No results found'
                            errorMessage={isFieldInvalid ? (form.errors[name] as string) : ''}
                            list={list}
                            name={name}
                            onBlur={() => {
                                if (!form.touched[name]) {
                                    form.setFieldTouched(name);
                                }
                            }}
                            onSearch={value => {
                                if (variant === 'prompt') {
                                    const search = list.find(
                                        item => item.text?.toString().toLowerCase() === value.toLowerCase()
                                    );
                                    if (search) {
                                        form.setFieldValue(name, search.value);
                                    } else {
                                        form.setFieldValue(name, undefined);
                                    }
                                }
                                if (onSearch) {
                                    onSearch(value);
                                }
                                return field.onChange;
                            }}
                            onSelect={value => {
                                form.setFieldValue(name, value);
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
