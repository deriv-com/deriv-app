import React from 'react';
import classNames from 'classnames';
import { Formik, Form, Field } from 'formik';
import { localize } from '@deriv/translations';
import { Input, Button } from '@deriv/components';

const DigitForm = ({ is_enabled, populateDigitResponse }) => {
    const [is_success, setSuccess] = React.useState(false);
    const button_text = is_enabled ? localize('Disable') : localize('Enable');

    const initial_form = {
        digit_code: '',
    };

    const validateFields = values => {
        const errors = {};

        const digit_code = values.digit_code;

        if (!digit_code) {
            errors.digit_code = localize('Digit code is required.');
        } else if (!(digit_code.length === 6)) {
            errors.digit_code = localize('Length of digit code must be 6 characters.');
        } else if (!/^[0-9]{6}$/g.test(digit_code)) {
            errors.digit_code = localize('Digit code must only contain numbers.');
        }

        return errors;
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(false);
        setSuccess(true);
        resetForm();
        populateDigitResponse(values);
    };

    return (
        <Formik initialValues={initial_form} onSubmit={handleSubmit} validate={validateFields}>
            {({ values, errors, isValid, touched, handleChange, handleBlur, isSubmitting }) => (
                <Form noValidate>
                    <div className='two-factor__input-group'>
                        <Field name='digit_code'>
                            {({ field }) => (
                                <Input
                                    {...field}
                                    data-lpignore='true'
                                    type='text'
                                    className='two-factor__input'
                                    label={localize('6 digit code')}
                                    value={values.digit_code}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    error={touched.digit_code && errors.digit_code}
                                />
                            )}
                        </Field>
                        <Button
                            className={classNames('two-factor__button', {
                                'two-factor__button--success': is_success,
                            })}
                            type='submit'
                            is_disabled={isSubmitting || !isValid}
                            has_effect
                            is_loading={isSubmitting}
                            is_submit_success={is_success}
                            text={button_text}
                            primary
                            large
                        />
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default DigitForm;
