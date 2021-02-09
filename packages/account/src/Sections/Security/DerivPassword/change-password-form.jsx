import classNames from 'classnames';
import React from 'react';
import { Formik } from 'formik';
import { FormSubmitErrorMessage, Button, Loading, PasswordInput, PasswordMeter } from '@deriv/components';
import { withRouter } from 'react-router-dom';
import { routes, isMobile, validPassword, validLength, getErrorMessages } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { WS } from 'Services/ws-methods';
import { connect } from 'Stores/connect';
import FormSubHeader from 'Components/form-sub-header';
import FormBody from 'Components/form-body';
import FormFooter from 'Components/form-footer';

class ChangePasswordForm extends React.Component {
    state = {
        is_loading: false,
        new_pw_input: '',
    };

    updateNewPassword = string => {
        this.setState({ new_pw_input: string });
    };

    handlePasswordChange = () => {
        const params = {
            action: 'redirect_to_login',
            header: 'password_changed',
        };
        const search_params = new URLSearchParams(params).toString();

        this.props.history.push({
            pathname: routes.root,
            search: `?${search_params}`,
        });
    };

    onSubmit = (values, { setSubmitting, setStatus }) => {
        setStatus({ msg: '' });
        this.setState({ is_btn_loading: true });
        WS.authorized.storage.changePassword(values).then(data => {
            this.setState({ is_btn_loading: false });
            if (data.error) {
                setStatus({ msg: data.error.message });
            } else {
                this.setState({ is_submit_success: true });
                this.props.logout().then(this.handlePasswordChange);
            }
            setSubmitting(false);
        });
    };

    validateFields = values => {
        this.setState({ is_submit_success: false });
        const errors = {};

        const required_fields = ['old_password', 'new_password'];
        required_fields.forEach(required => {
            if (!values[required]) errors[required] = localize('This field is required');
        });

        if (values.new_password) {
            if (!validLength(values.new_password, { min: 8, max: 25 })) {
                errors.new_password = localize('Password length should be between 8 to 25 characters.');
            }
            if (values.old_password === values.new_password) {
                errors.new_password = localize('Current password and new password cannot be the same.');
            }
            if (values.new_password.toLowerCase() === this.props.email.toLowerCase()) {
                errors.new_password = localize('Your password cannot be the same as your email address.');
            }
            if (!validPassword(values.new_password)) {
                errors.new_password = getErrorMessages().password();
            }
        }

        return errors;
    };

    render() {
        const { is_loading, new_pw_input, is_btn_loading, is_submit_success } = this.state;

        return (
            <React.Fragment>
                <Formik
                    initialValues={{
                        old_password: '',
                        new_password: '',
                    }}
                    validate={this.validateFields}
                    onSubmit={this.onSubmit}
                >
                    {({
                        values,
                        errors,
                        touched,
                        status,
                        setFieldTouched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                    }) => (
                        <form className='account-form account__password-wrapper' onSubmit={handleSubmit}>
                            {is_loading ? (
                                <FormBody>
                                    <Loading is_fullscreen={false} className='account__initial-loader' />;
                                </FormBody>
                            ) : (
                                <FormBody scroll_offset={isMobile() ? '200px' : '55px'}>
                                    <FormSubHeader title={localize('Change your Deriv password')} />
                                    <fieldset className='account-form__fieldset'>
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
                                    <fieldset className='account-form__fieldset'>
                                        <PasswordMeter
                                            input={new_pw_input}
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
                                                onChange={e => {
                                                    const input = e.target;
                                                    setFieldTouched('new_password', true);
                                                    if (input) this.updateNewPassword(input.value);
                                                    handleChange(e);
                                                }}
                                            />
                                        </PasswordMeter>
                                    </fieldset>
                                </FormBody>
                            )}
                            <FormFooter>
                                {status?.msg && (
                                    <FormSubmitErrorMessage
                                        className={classNames({ 'account-form__error-message': isMobile() })}
                                        message={status.msg}
                                    />
                                )}
                                <Button
                                    className={classNames('account-form__footer-btn', {
                                        'account-form__footer-btn--has-bottom-margin': isMobile(),
                                    })}
                                    type='button'
                                    onClick={this.props.onClickSendEmail}
                                    text={localize('Forgot your password?')}
                                    tertiary
                                    large
                                />
                                <Button
                                    className='account-form__footer-btn'
                                    type='submit'
                                    is_disabled={
                                        isSubmitting ||
                                        !!(
                                            errors.new_password ||
                                            !values.new_password ||
                                            errors.old_password ||
                                            !values.old_password
                                        )
                                    }
                                    is_loading={is_btn_loading}
                                    is_submit_success={is_submit_success}
                                    has_effect
                                    text={localize('Change password')}
                                    primary
                                    large
                                />
                            </FormFooter>
                        </form>
                    )}
                </Formik>
            </React.Fragment>
        );
    }
}

// ChangePasswordForm.propTypes = {};
export default connect(({ client }) => ({
    logout: client.logout,
    email: client.email,
}))(withRouter(ChangePasswordForm));
