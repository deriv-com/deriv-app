import React from 'react';
import classNames from 'classnames';
import { Formik, Form, Field, FieldProps, FormikProps } from 'formik';
import { Input, Button } from '@deriv/components';
import { useSendUserOTP } from '@deriv/api';
import { localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';

type TDigitFormValues = {
    digit_code: string;
};

const DigitForm = observer(() => {
    const { client, common } = useStore();
    const { is_language_changing } = common;
    const { has_enabled_two_fa, setTwoFAChangedStatus, setTwoFAStatus } = client;

    const { is_TwoFA_enabled, error, isSuccess, sendUserOTP } = useSendUserOTP();
    const button_text = has_enabled_two_fa ? localize('Disable') : localize('Enable');
    const formik_ref = React.useRef<FormikProps<TDigitFormValues>>(null);

    const initial_form = {
        digit_code: '',
    };

    React.useEffect(() => {
        if (is_language_changing) {
            formik_ref.current?.setFieldTouched('digit_code');
        }
    }, [is_language_changing]);

    React.useEffect(() => {
        if (error) {
            if (typeof error === 'object' && 'code' in error && 'message' in error) {
                const { code, message } = error;
                if (code === 'InvalidOTP')
                    formik_ref.current?.setFieldError(
                        'digit_code',
                        localize("That's not the right code. Please try again.")
                    );
                else {
                    formik_ref.current?.setFieldError('digit_code', message as string);
                }
            }
        }
    }, [error]);

    React.useEffect(() => {
        if (isSuccess) {
            setTwoFAStatus(is_TwoFA_enabled);
            setTwoFAChangedStatus(true);
            formik_ref.current?.resetForm();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, is_TwoFA_enabled]);

    const validateFields = async (values: TDigitFormValues) => {
        const digit_code = values.digit_code;
        if (!digit_code) {
            return { digit_code: localize('Digit code is required.') };
        } else if (!(digit_code.length === 6)) {
            return { digit_code: localize('Length of digit code must be 6 characters.') };
        } else if (!/^[0-9]{6}$/g.test(digit_code)) {
            return { digit_code: localize('Digit code must only contain numbers.') };
        }
        return {};
    };

    const handleSubmit = async (values: TDigitFormValues) => {
        const action = has_enabled_two_fa ? 'disable' : 'enable';
        sendUserOTP({ totp_action: action, otp: values.digit_code });
    };

    return (
        <Formik initialValues={initial_form} onSubmit={handleSubmit} validate={validateFields} innerRef={formik_ref}>
            {({ values, errors, isValid, touched, handleChange, handleBlur, isSubmitting, dirty }) => (
                <Form noValidate>
                    <div className='two-factor__input-group'>
                        <Field name='digit_code'>
                            {({ field }: FieldProps) => (
                                <Input
                                    {...field}
                                    data-lpignore='true'
                                    type='text'
                                    className='two-factor__input'
                                    label={localize('Authentication code')}
                                    value={values.digit_code}
                                    onChange={e => {
                                        handleChange(e);
                                    }}
                                    onBlur={handleBlur}
                                    required
                                    error={touched.digit_code && errors.digit_code ? errors.digit_code : undefined}
                                    maxLength={6}
                                    autoComplete='off'
                                />
                            )}
                        </Field>
                        <Button
                            className={classNames('two-factor__button', {
                                'two-factor__button--success': isSuccess,
                            })}
                            type='submit'
                            is_disabled={isSubmitting || !isValid || !dirty}
                            has_effect
                            is_loading={isSubmitting}
                            is_submit_success={isSuccess}
                            text={button_text}
                            large
                            primary
                        />
                    </div>
                </Form>
            )}
        </Formik>
    );
});

export default DigitForm;
