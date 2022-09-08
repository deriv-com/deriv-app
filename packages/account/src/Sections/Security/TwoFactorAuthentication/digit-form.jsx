import React from 'react';
import classNames from 'classnames';
import { Formik, Form, Field } from 'formik';
import { Input, Button } from '@deriv/components';
import { localize } from '@deriv/translations';

const DigitForm = ({ is_enabled }) => {
    const [is_success] = React.useState(false);
    const button_text = is_enabled ? localize('Disable 2FA') : localize('Enable');

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

    return (
        <Formik initialValues={initial_form} validate={validateFields}>
            {({ values, errors, isValid, touched, handleChange, handleBlur, isSubmitting, dirty }) => (
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
                            is_disabled={isSubmitting || !isValid || !dirty}
                            has_effect
                            is_loading={isSubmitting}
                            is_submit_success={is_success}
                            text={button_text}
                            large
                            primary
                        />
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default DigitForm;
