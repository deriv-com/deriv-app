import React, { FC } from 'react';
import WalletTextField, { WalletTextFieldProps } from '../Base/WalletTextField/WalletTextField';
import { Field, FieldProps } from 'formik';

export interface TFlowFieldProps extends WalletTextFieldProps {
    isInvalid?: WalletTextFieldProps['isInvalid'];
    name: string;
}

/**
 * This component is just a wrapper to the Field Formik compoennt and WalletTextField
 * Use this component when you are using the FlowProvider with a form and several inputs,
 * and you want those input values to be tracked and validated
 */
const FlowTextField: FC<TFlowFieldProps> = ({ isInvalid = 'false', name, ...rest }) => {
    return (
        <Field name={name}>
            {({ field, form, meta }: FieldProps) => {
                return (
                    <WalletTextField
                        {...rest}
                        {...field}
                        errorMessage={form.errors[name]}
                        isInvalid={meta.value !== meta.initialValue && Boolean(form.errors[name])}
                    />
                );
            }}
        </Field>
    );
};

export default FlowTextField;
