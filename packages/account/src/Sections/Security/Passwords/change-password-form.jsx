import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { PasswordInput, PasswordMeter } from '@deriv/components';
import { useHistory } from 'react-router-dom';
import { routes, isMobile, useIsMounted, validPassword, validLength, getErrorMessages } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { WS } from 'Services/ws-methods';
import { connect } from 'Stores/connect';
import PasswordsFooter from './passwords-footer.jsx';

const ChangePasswordForm = ({ email, is_trading_password, logout, onClickSendEmail, onPasswordChange }) => {
    const [is_btn_loading, setIsBtnLoading] = React.useState(false);
    const [is_submit_success, setIsSubmitSuccess] = React.useState(false);

    const isMounted = useIsMounted();
    const history = useHistory();

    const handlePasswordChange = () => {
        const params = {
            action: 'redirect_to_login',
            header: 'password_changed',
        };
        const search_params = new URLSearchParams(params).toString();

        history.push({
            pathname: routes.root,
            search: `?${search_params}`,
        });
    };

    const onSubmit = (values, { setSubmitting, setStatus, resetForm }) => {
        setStatus({ msg: '' });
        setIsBtnLoading(true);
        setSubmitting(true);
        if (is_trading_password) {
            WS.tradingPlatformPasswordChange(values).then(data => {
                if (isMounted()) {
                    setIsBtnLoading(false);
                    if (data.error) {
                        setStatus({ msg: data.error.message });
                        setTimeout(() => {
                            if (isMounted()) {
                                setStatus({ msg: '' });
                            }
                        }, 3000);
                    } else {
                        setIsSubmitSuccess(true);
                        resetForm({ new_password: '' });
                        onPasswordChange?.();
                        setTimeout(() => {
                            if (isMounted()) {
                                setIsSubmitSuccess(false);
                            }
                        }, 3000);
                    }
                    setSubmitting(false);
                }
            });
        } else {
            WS.authorized.storage.changePassword(values).then(data => {
                if (isMounted()) {
                    setIsBtnLoading(false);
                    if (data.error) {
                        setStatus({ msg: data.error.message });
                        setTimeout(() => {
                            if (isMounted()) {
                                setStatus({ msg: '' });
                            }
                        }, 3000);
                    } else {
                        setIsSubmitSuccess(true);
                        window.localStorage.setItem('is_redirecting', 'true');
                        logout().then(handlePasswordChange);
                    }
                    setSubmitting(false);
                }
            });
        }
    };

    const validateFields = values => {
        setIsSubmitSuccess(false);
        const errors = {};

        const required_fields = ['old_password', 'new_password'];
        required_fields.forEach(required => {
            if (!values[required]) errors[required] = localize('This field is required');
        });

        if (values.new_password) {
            if (!validLength(values.new_password, { min: 8, max: 25 })) {
                errors.new_password = localize('Your password should be between 8 and 25 characters.');
            }
            if (values.old_password === values.new_password) {
                errors.new_password = localize('Current password and new password cannot be the same.');
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
                    old_password: '',
                    new_password: '',
                }}
                validate={validateFields}
                onSubmit={onSubmit}
            >
                {({ values, errors, touched, status, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                    <form className='account__passwords-item-right' onSubmit={handleSubmit}>
                        <div scroll_offset={isMobile() ? '200px' : '55px'}>
                            <fieldset className='account__passwords-fieldset'>
                                <PasswordInput
                                    autoComplete='current-password'
                                    label={localize('Current password')}
                                    error={touched.old_password && errors.old_password}
                                    name='old_password'
                                    value={values.old_password}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                            </fieldset>
                            <fieldset className='account__passwords-fieldset'>
                                <PasswordMeter
                                    input={values.new_password}
                                    has_error={!!(touched.new_password && errors.new_password)}
                                    custom_feedback_messages={getErrorMessages().password_warnings}
                                >
                                    <PasswordInput
                                        autoComplete='new-password'
                                        label={localize('New password')}
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
                            is_submit_success={is_submit_success}
                            isSubmitting={isSubmitting}
                            onClickSendEmail={onClickSendEmail}
                            status={status}
                            values={values}
                        />
                    </form>
                )}
            </Formik>
        </React.Fragment>
    );
};

ChangePasswordForm.propTypes = {
    email: PropTypes.string,
    is_trading_password: PropTypes.bool,
    logout: PropTypes.func,
    onClickSendEmail: PropTypes.func,
    onPasswordChange: PropTypes.func,
};

export default connect(({ client }) => ({
    logout: client.logout,
    email: client.email,
}))(ChangePasswordForm);
