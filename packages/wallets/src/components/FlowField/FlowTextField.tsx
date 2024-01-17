import React, { forwardRef, Ref, useEffect, useState } from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import * as Yup from 'yup';
import WalletTextField, { WalletTextFieldProps } from '../Base/WalletTextField/WalletTextField';
import { useFlow } from '../FlowProvider';

export interface TFlowFieldProps extends WalletTextFieldProps {
    isInvalid?: WalletTextFieldProps['isInvalid'];
    name: string;
    validationSchema?: Yup.AnySchema;
}

/**
 * This component is just a wrapper to the Field Formik component and WalletTextField
 * Use this component when you are using the FlowProvider with a form and several inputs,
 * and you want those input values to be tracked and validated
 */
const FlowTextField = forwardRef(
    (
        { defaultValue, disabled, errorMessage, isInvalid, name, validationSchema, ...rest }: TFlowFieldProps,
        ref: Ref<HTMLInputElement>
    ) => {
        const [hasTouched, setHasTouched] = useState(false);
        const { setFormValues } = useFlow();
        const { setFieldTouched } = useFormikContext();

        const validateField = (value: unknown) => {
            try {
                if (validationSchema) {
                    validationSchema.validateSync(value);
                }
            } catch (err: unknown) {
                return (err as Yup.ValidationError).message;
            }
        };

        useEffect(() => {
            const setFormValuesAndTouch = async () => {
                if (defaultValue) {
                    await setFormValues(name, defaultValue, true);
                    setFieldTouched(name, true, true);
                }
            };

            setFormValuesAndTouch();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return (
            <Field name={name} validate={validateField}>
                {({ field, form }: FieldProps) => {
                    return (
                        <WalletTextField
                            {...rest}
                            defaultValue={defaultValue}
                            disabled={disabled}
                            errorMessage={hasTouched && (form.errors[name] || errorMessage)}
                            isInvalid={(hasTouched && isInvalid) || (hasTouched && Boolean(form.errors[name]))}
                            name={field.name}
                            onChange={field.onChange}
                            onFocus={e => {
                                setHasTouched(true);
                                field.onBlur(e);
                            }}
                            ref={ref}
                        />
                    );
                }}
            </Field>
        );
    }
);

FlowTextField.displayName = 'FlowTextField';
export default FlowTextField;
