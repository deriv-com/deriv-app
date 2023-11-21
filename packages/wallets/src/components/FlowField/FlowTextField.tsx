import React, { forwardRef, Ref } from 'react';
import { Field, FieldProps } from 'formik';
import WalletTextField, { WalletTextFieldProps } from '../Base/WalletTextField/WalletTextField';

export interface TFlowFieldProps extends WalletTextFieldProps {
    isInvalid?: WalletTextFieldProps['isInvalid'];
    name: string;
}

/**
 * This component is just a wrapper to the Field Formik component and WalletTextField
 * Use this component when you are using the FlowProvider with a form and several inputs,
 * and you want those input values to be tracked and validated
 */
const FlowTextField = forwardRef(({ isInvalid, name, ...rest }: TFlowFieldProps, ref: Ref<HTMLInputElement>) => {
    return (
        <Field name={name}>
            {({ field, form, meta }: FieldProps) => {
                return (
                    <WalletTextField
                        {...rest}
                        {...field}
                        errorMessage={form.errors[name]}
                        isInvalid={isInvalid || (meta.value !== meta.initialValue && Boolean(form.errors[name]))}
                        ref={ref}
                    />
                );
            }}
        </Field>
    );
});

FlowTextField.displayName = 'FlowTextField';
export default FlowTextField;
