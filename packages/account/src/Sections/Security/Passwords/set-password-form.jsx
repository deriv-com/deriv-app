import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { PasswordInput, PasswordMeter } from '@deriv/components';
import { withRouter } from 'react-router-dom';
import { isMobile, validPassword, validLength, getErrorMessages } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { WS } from 'Services/ws-methods';
import { connect } from 'Stores/connect';
import PasswordsFooter from './passwords-footer.jsx';

const SetPasswordForm = ({ email }) => {
    const [is_btn_loading, setIsBtnLoading] = React.useState(false);
    const [is_submit_success, setIsSubmitSuccess] = React.useState(false);

    const onSubmit = (values, { setSubmitting, setStatus }) => {
        setStatus({ msg: '' });
        setIsBtnLoading(true);
        const params = {
            new_password: values.new_password,
            old_password: '',
        };
        WS.tradingPlatformPasswordChange(params).then(data => {
            setIsBtnLoading(false);
            if (data.error) {
                setStatus({ msg: data.error.message });
                setSubmitting(false);
            } else {
                setIsSubmitSuccess(true);
                setTimeout(() => {
                    WS.getAccountStatus();
                    setIsSubmitSuccess(false);
                    setSubmitting(false);
                }, 3000);
            }
        });
    };

    const validateFields = values => {
        setIsSubmitSuccess(false);
        const errors = {};

        const required_fields = ['new_password'];
        required_fields.forEach(required => {
            if (!values[required]) errors[required] = localize('This field is required');
        });

        if (values.new_password) {
            if (!validLength(values.new_password, { min: 8, max: 25 })) {
                errors.new_password = localize('Password length should be between 8 to 25 characters.');
            }
            if (values.new_password.toLowerCase() === email.toLowerCase()) {
                errors.new_password = localize('Your password cannot be the same as your email address.');
            }
            if (!validPassword(values.new_password)) {
                errors.new_password = getErrorMessages().password();
            }
        }

        return errors;
    };

    return (
        <React.Fragment>
            <Formik
                initialValues={{
                    new_password: '',
                }}
                validate={validateFields}
                onSubmit={onSubmit}
            >
                {({ values, errors, touched, status, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                    <form className='account__passwords-item-right' onSubmit={handleSubmit}>
                        <div scroll_offset={isMobile() ? '200px' : '55px'}>
                            <fieldset className='account__passwords-fieldset'>
                                <PasswordMeter
                                    input={values.new_password}
                                    has_error={!!(touched.new_password && errors.new_password)}
                                    custom_feedback_messages={getErrorMessages().password_warnings}
                                >
                                    <PasswordInput
                                        autoComplete='new-trading-password'
                                        label={localize('Trading password')}
                                        error={touched.new_password && errors.new_password}
                                        name='new_password'
                                        value={values.new_password}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        data-lpignore='true'
                                        required
                                    />
                                </PasswordMeter>
                            </fieldset>
                        </div>
                        <PasswordsFooter
                            errors={errors}
                            is_btn_loading={is_btn_loading}
                            is_set_trade_password
                            is_submit_success={is_submit_success}
                            isSubmitting={isSubmitting}
                            status={status}
                            values={values}
                        />
                    </form>
                )}
            </Formik>
        </React.Fragment>
    );
};

SetPasswordForm.propTypes = {
    email: PropTypes.string,
};

export default connect(({ client }) => ({
    email: client.email,
}))(withRouter(SetPasswordForm));
