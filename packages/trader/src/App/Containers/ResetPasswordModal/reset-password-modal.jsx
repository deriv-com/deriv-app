import classNames        from 'classnames';
import {
    Input,
    Button,
    Dialog }             from 'deriv-components';
import {
    Formik,
    Form }               from 'formik';
import PropTypes         from 'prop-types';
import React             from 'react';
import Localize          from 'App/Components/Elements/localize.jsx';
import { localize }      from 'App/i18n';
import { connect }       from 'Stores/connect';
import { validPassword } from 'Utils/Validator/declarative-validation-rules';
import { redirectToLogin } from '_common/base/login';
import { requestLogout } from 'Services/index';

const resetInitialValues = { password: '' };

class ResetPassword extends React.Component {
    onResetComplete = (error_msg, actions) => {
        actions.setSubmitting(false);
        // Error would be returned on invalid token (and the like) cases.
        // TODO: Proper error handling (currently we have no place to put the message)
        if (error_msg) {
            // eslint-disable-next-line no-console
            console.error(error_msg);
            actions.setStatus({ error_msg });
            return;
        }

        actions.setStatus({ reset_complete: true });

        requestLogout().then(() => {
            redirectToLogin();
        });
    };

    handleSubmit = (values, actions) => {
        const { onResetPassword } = this.props;

        onResetPassword(values.password, this.onResetComplete, actions);
    }

    validateReset = (values) => {
        const errors = {};
        const min_password_length = 6;

        if (values.password && (values.password.length < min_password_length || !validPassword(values.password))) {
            errors.password = true;
        }
    
        return errors;
    };

    render() {
        return (
            <div className='reset-password'>
                <Formik
                    initialValues={resetInitialValues}
                    initialStatus={{ reset_complete: false, error_msg: '' }}
                    validate={this.validateReset}
                    onSubmit={this.handleSubmit}
                >
                    {({ handleBlur, errors, values, touched, isSubmitting, handleChange, status }) => (
                        <Form>
                            <React.Fragment>
                                {status.reset_complete ? (
                                    <div className='reset-password__password-selection'>
                                        <p className='reset-password__heading'>
                                            <Localize i18n_default_text='Your password has been changed' />
                                        </p>
                                        <p className='reset-password__subtext'>
                                            <Localize
                                                i18n_default_text='We will now redirect you to the login page.'
                                            />
                                        </p>
                                    </div>
                                ) : (
                                    <div className='reset-password__password-selection'>
                                        <p className='reset-password__heading'>
                                            <Localize i18n_default_text='Choose a new password' />
                                        </p>
                                        <Input
                                            className='reset-password__password-field'
                                            name='password'
                                            type='password'
                                            label={localize('Create a password')}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.password && errors.password}
                                            value={values.password}
                                            data-lpignore='true'
                                            required
                                        />
                                        <p className='reset-password__subtext'>
                                            {status.error_msg ? (
                                                <Localize
                                                    i18n_default_text='{{error_msg}}'
                                                    values={{ error_msg: status.error_msg }}
                                                />
                                            ) : (
                                                <Localize
                                                    i18n_default_text='Strong passwords contain at least 6 characters, combine uppercase and lowercase letters, numbers, and symbols.'
                                                />
                                            )}
                                        </p>

                                        <Button
                                            className={classNames('reset-password__btn', { 'reset-password__btn--disabled': !values.password || errors.password || isSubmitting })}
                                            type='submit'
                                            is_disabled={!values.password || errors.password || isSubmitting}
                                        >
                                            <Localize i18n_default_text='Reset my password' />
                                        </Button>
                                    </div>
                                )}

                            </React.Fragment>
                        </Form>
                    )}
                </Formik>
            </div>
        );
    }
}

ResetPassword.propTypes = {
    enableApp        : PropTypes.func,
    isModalVisible   : PropTypes.func,
    onResetPassword  : PropTypes.func,
    verification_code: PropTypes.string,
};

const ResetPasswordModal = ({
    enableApp,
    disableApp,
    is_loading,
    is_visible,
    onResetPassword,
    verification_code,
    toggleResetPasswordModal,
}) => {
    return (
        <Dialog
            is_visible={is_visible}
            disableApp={disableApp}
            enableApp={enableApp}
            is_loading={is_loading}
        >
            <ResetPassword
                verification_code={verification_code}
                isModalVisible={toggleResetPasswordModal}
                enableApp={enableApp}
                onResetPassword={onResetPassword}
            />
        </Dialog>
    );
};

ResetPasswordModal.propTypes = {
    disableApp              : PropTypes.func,
    enableApp               : PropTypes.func,
    is_loading              : PropTypes.bool,
    is_visible              : PropTypes.bool,
    onResetPassword         : PropTypes.func,
    toggleResetPasswordModal: PropTypes.func,
    verification_code       : PropTypes.string,
};

export default connect(
    ({ ui, client }) => ({
        is_visible              : ui.is_reset_password_modal_visible,
        enableApp               : ui.enableApp,
        disableApp              : ui.disableApp,
        is_loading              : ui.is_loading,
        toggleResetPasswordModal: ui.toggleResetPasswordModal,
        verification_code       : client.verification_code,
        onResetPassword         : client.onResetPassword,
    }),
)(ResetPasswordModal);
