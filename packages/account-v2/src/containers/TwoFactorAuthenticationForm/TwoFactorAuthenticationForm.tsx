import React, { useEffect, useRef } from 'react';
import { Form, Formik, FormikProps } from 'formik';
import { useTwoFactorAuthentication, useTwoFactorAuthenticationStatus } from '@deriv/api-v2';
import { InputWithButton } from '../../components/InputWithButton';
import { ACCOUNT_SECURITY, getTwoFactorAuthenticationFormValidationSchema } from '../../utils';

type TTwoFactorData = {
    digitCode: string;
};

export const TwoFactorAuthenticationForm = () => {
    const { data: isTwoFactorAuthenticationEnabled, isLoading: isStatusLoading } = useTwoFactorAuthenticationStatus();
    const { error, isLoading: isMutationLoading, mutate } = useTwoFactorAuthentication();
    const validationSchema = getTwoFactorAuthenticationFormValidationSchema();
    // TODO: Remember to translate these
    const buttonText = !isStatusLoading && isTwoFactorAuthenticationEnabled ? 'Disable' : 'Enable';
    const initialValues: TTwoFactorData = {
        digitCode: '',
    };
    const formRef = useRef<FormikProps<TTwoFactorData>>(null);
    useEffect(() => {
        if (error && error.error.code === ACCOUNT_SECURITY.INVALID_OTP) {
            formRef.current?.setFieldError('digitCode', "That's not the right code. Please try again.");
        }
        formRef.current?.setSubmitting(false);
    }, [error]);
    const handleSubmit = (values: TTwoFactorData) => {
        const totpAction = isTwoFactorAuthenticationEnabled ? 'disable' : 'enable';
        mutate({ otp: values.digitCode, totp_action: totpAction });
    };
    return (
        <Formik initialValues={initialValues} innerRef={formRef} onSubmit={handleSubmit}>
            {({ dirty, handleBlur, handleChange, isSubmitting, isValid, submitForm }) => (
                <Form noValidate>
                    <InputWithButton
                        buttonText={buttonText}
                        isDisabled={isSubmitting || !isValid || !dirty || isMutationLoading}
                        isLoading={isSubmitting}
                        label='Authentication code'
                        maxLength={6}
                        name='digitCode'
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onClick={async () => {
                            await submitForm();
                        }}
                        validationSchema={validationSchema.fields.digitCode}
                    />
                </Form>
            )}
        </Formik>
    );
};
