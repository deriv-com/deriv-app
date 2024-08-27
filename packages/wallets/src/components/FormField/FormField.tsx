import React, { forwardRef, Ref } from 'react';
import { Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import WalletTextField, { WalletTextFieldProps } from '../Base/WalletTextField/WalletTextField';

export interface TFormFieldProps extends WalletTextFieldProps {
    isInvalid?: WalletTextFieldProps['isInvalid'];
    name: string;
    validationSchema?: Yup.AnySchema;
}

/**
 * A WalletTextField component wrapped with Formik Field to provide form validations and
 * other Formik functionalities.
 */
const FormField = forwardRef(
    (
        { disabled, errorMessage, name, showMessage, validationSchema, ...rest }: TFormFieldProps,
        ref: Ref<HTMLInputElement>
    ) => {
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
                    const fieldHasValue = field.value && field.value.length > 0;
                    const isFieldInvalid = Boolean((form.touched[name] || fieldHasValue) && form.errors[name]);
                    return (
                        <WalletTextField
                            {...rest}
                            defaultValue={field.value}
                            disabled={disabled}
                            errorMessage={isFieldInvalid && (form.errors[name] ?? errorMessage)}
                            isInvalid={isFieldInvalid}
                            name={field.name}
                            onBlur={() => {
                                if (!form.touched[name]) {
                                    form.setFieldTouched(name);
                                }
                            }}
                            onChange={e => {
                                if (!form.touched[name]) {
                                    form.setFieldTouched(name);
                                }
                                form.setFieldValue(name, e.target.value);
                            }}
                            ref={ref}
                            showMessage={!isFieldInvalid && showMessage}
                        />
                    );
                }}
            </Field>
        );
    }
);

FormField.displayName = 'FormField';
export default FormField;
