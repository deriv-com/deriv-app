import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { Button, Dialog, PasswordInput, PasswordMeter, Text } from '@deriv/components';
import { redirectToLogin, validPassword, validLength, getErrorMessages } from '@deriv/shared';
import { getLanguage, localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { WS } from 'Services/index';

const ResetPassword = ({ logoutClient, verification_code }) => {
    const onResetComplete = (error_msg, actions) => {
        actions.setSubmitting(false);
        actions.resetForm({ password: '' });
        // Error would be returned on invalid token (and the like) cases.
        // TODO: Proper error handling (currently we have no place to put the message)
        if (error_msg) {
            // eslint-disable-next-line no-console
            console.error(error_msg);
            actions.setStatus({ error_msg });
            return;
        }

        actions.setStatus({ reset_complete: true });

        logoutClient().then(() => {
            redirectToLogin(false, getLanguage());
        });
    };

    const handleSubmit = (values, actions) => {
        const api_request = {
            reset_password: 1,
            new_password: values.password,
            verification_code,
        };

        WS.resetPassword(api_request).then(async response => {
            if (response.error) {
                onResetComplete(response.error.message, actions);
            } else {
                onResetComplete(null, actions);
            }
        });
    };

    const validateReset = values => {
        const errors = {};

        if (
            !validLength(values.password, {
                min: 8,
                max: 25,
            })
        ) {
            errors.password = localize('You should enter {{min_number}}-{{max_number}} characters.', {
                min_number: 8,
                max_number: 25,
            });
        } else if (!validPassword(values.password)) {
            errors.password = getErrorMessages().password();
        }

        return errors;
    };

    const reset_initial_values = { password: '' };

    return (
        <div className='reset-password'>
            <Formik
                initialValues={reset_initial_values}
                initialStatus={{ reset_complete: false, error_msg: '' }}
                validate={validateReset}
                onSubmit={handleSubmit}
            >
                {({ handleBlur, errors, values, touched, isSubmitting, handleChange, status }) => (
                    <Form>
                        <React.Fragment>
                            {status.reset_complete ? (
                                <div className='reset-password__password-selection'>
                                    <Text as='p' weight='bold' className='reset-password__heading'>
                                        <Localize i18n_default_text='Your password has been changed' />
                                    </Text>
                                    <Text align='center' as='p' size='xxs' className='reset-password__subtext'>
                                        <Localize i18n_default_text='We will now redirect you to the login page.' />
                                    </Text>
                                </div>
                            ) : (
                                <div className='reset-password__password-selection'>
                                    <Text as='p' weight='bold' className='reset-password__heading'>
                                        <Localize i18n_default_text='Choose a new password' />
                                    </Text>
                                    <fieldset className='reset-password__fieldset'>
                                        <PasswordMeter
                                            input={values.password}
                                            has_error={!!(touched.password && errors.password)}
                                            custom_feedback_messages={getErrorMessages().password_warnings}
                                        >
                                            <PasswordInput
                                                autoComplete='new-password'
                                                className='reset-password__password-field'
                                                name='password'
                                                label={localize('Create a password')}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.password && errors.password}
                                                value={values.password}
                                                data-lpignore='true'
                                                required
                                            />
                                        </PasswordMeter>
                                    </fieldset>
                                    <Text align='center' as='p' size='xxs' className='reset-password__subtext'>
                                        {status.error_msg ? (
                                            <Localize
                                                i18n_default_text='{{error_msg}}'
                                                values={{ error_msg: status.error_msg }}
                                            />
                                        ) : (
                                            <Localize i18n_default_text='Strong passwords contain at least 8 characters, combine uppercase and lowercase letters, numbers, and symbols.' />
                                        )}
                                    </Text>

                                    <Button
                                        className={classNames('reset-password__btn', {
                                            'reset-password__btn--disabled':
                                                !values.password || errors.password || isSubmitting,
                                        })}
                                        type='submit'
                                        is_disabled={!values.password || !!errors.password || isSubmitting}
                                        primary
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
};

ResetPassword.propTypes = {
    logoutClient: PropTypes.func,
    verification_code: PropTypes.string,
};

const ResetPasswordModal = ({ disableApp, enableApp, is_loading, is_visible, logoutClient, verification_code }) => {
    return (
        <Dialog is_visible={is_visible} disableApp={disableApp} enableApp={enableApp} is_loading={is_loading}>
            <ResetPassword verification_code={verification_code} logoutClient={logoutClient} />
        </Dialog>
    );
};

ResetPasswordModal.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    is_loading: PropTypes.bool,
    is_visible: PropTypes.bool,
    logoutClient: PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(({ ui, client }) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_loading: ui.is_loading,
    is_visible: ui.is_reset_password_modal_visible,
    logoutClient: client.logout,
    verification_code: client.verification_code.reset_password,
}))(ResetPasswordModal);
