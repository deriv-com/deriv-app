import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { Button, Dialog, Icon, PasswordInput, PasswordMeter, Text } from '@deriv/components';
import {
    getErrorMessages,
    redirectToLogin,
    toTitleCase,
    validPassword,
    validLength,
    getActionFromUrl,
    removeActionParam,
} from '@deriv/shared';
import { getLanguage, localize, Localize } from '@deriv/translations';
import { WS } from 'Services';
import { observer, useStore } from '@deriv/stores';

const UnlinkPassword = ({
    logoutClient,
    social_identity_provider,
    toggleResetPasswordModal,
    verification_code,
    new_email,
}) => {
    const url_action = getActionFromUrl();
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
    };

    const onGetPasswordResponse = (response, actions) => {
        if (response.error) {
            onResetComplete(response.error.message, actions);
        } else {
            onResetComplete(null, actions);
        }
    };

    const handleSubmit = (values, actions) => {
        if (url_action === 'social_email_change') {
            const api_request = {
                change_email: 'update',
                new_email,
                new_password: values.password,
                verification_code,
            };

            WS.changeEmail(api_request).then(async response => {
                onGetPasswordResponse(response, actions);
            });
        } else {
            const api_request = {
                reset_password: 1,
                new_password: values.password,
                verification_code,
            };
            WS.resetPassword(api_request).then(async response => {
                onGetPasswordResponse(response, actions);
            });
        }
        removeActionParam('social_email_change');
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
        <div className='unlink-password'>
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
                                <div className='unlink-password__password-success'>
                                    <Icon
                                        className='unlink-password__icon'
                                        icon={`IcUnlink${toTitleCase(social_identity_provider)}`}
                                        size={128}
                                    />
                                    <Text as='p' weight='bold' className='unlink-password__heading'>
                                        <Localize i18n_default_text='Success!' />
                                    </Text>
                                    <Text align='center' as='p' size='xs' className='unlink-password__subtext'>
                                        <Localize
                                            i18n_default_text={
                                                'Your Deriv account has been unlinked from your {{social_identity_provider}} account. You can now log in to Deriv using your new email address and password.'
                                            }
                                            values={{
                                                social_identity_provider: toTitleCase(social_identity_provider),
                                            }}
                                        />
                                    </Text>
                                    <Button
                                        type='button'
                                        onClick={() => {
                                            toggleResetPasswordModal(false);
                                            logoutClient().then(() => {
                                                redirectToLogin(false, getLanguage(), false);
                                            });
                                        }}
                                        primary
                                        large
                                    >
                                        <Localize i18n_default_text='Login now' />
                                    </Button>
                                </div>
                            ) : (
                                <div className='unlink-password__set-password'>
                                    <Text as='p' weight='bold' className='unlink-password__heading'>
                                        <Localize i18n_default_text='Deriv password' />
                                    </Text>
                                    <Text as='p' size='xs' className='unlink-password__subtext'>
                                        <Localize i18n_default_text='Enter a new password for your Deriv account.' />
                                    </Text>
                                    <fieldset className='unlink-password__input-field'>
                                        <PasswordMeter
                                            input={values.password}
                                            has_error={!!(touched.password && errors.password)}
                                            custom_feedback_messages={getErrorMessages().password_warnings}
                                        >
                                            <PasswordInput
                                                autoComplete='new-password'
                                                className='unlink-password__password-field'
                                                name='password'
                                                label={localize('Deriv password')}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.password && errors.password}
                                                value={values.password}
                                                data-lpignore='true'
                                                required
                                            />
                                        </PasswordMeter>
                                    </fieldset>
                                    <Text as='p' size='xs' className='unlink-password__hint'>
                                        {status.error_msg ? (
                                            localize(status.error_msg)
                                        ) : (
                                            <Localize i18n_default_text='Strong passwords contain at least 8 characters, combine uppercase and lowercase letters, numbers, and symbols.' />
                                        )}
                                    </Text>
                                    <Button
                                        className={classNames('unlink-password__btn', {
                                            'unlink-password__btn--disabled':
                                                !values.password || errors.password || isSubmitting,
                                        })}
                                        type='submit'
                                        is_disabled={!values.password || !!errors.password || isSubmitting}
                                        primary
                                        large
                                    >
                                        <Localize i18n_default_text='Confirm' />
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

UnlinkPassword.propTypes = {
    logoutClient: PropTypes.func,
    toggleResetPasswordModal: PropTypes.func,
    verification_code: PropTypes.string,
    social_identity_provider: PropTypes.string,
};

const UnlinkPasswordModal = observer(() => {
    const { ui, client } = useStore();
    const { logout: logoutClient, social_identity_provider, verification_code } = client;
    const {
        disableApp,
        enableApp,
        is_loading,
        is_reset_password_modal_visible: is_visible,
        toggleResetPasswordModal,
    } = ui;
    const reset_verification_code = verification_code.reset_password;
    const unlink_verification_code = verification_code.social_email_change;
    const new_email = client.new_email.social_email_change;
    return (
        <Dialog
            className='unlink-password__dialog'
            is_visible={is_visible}
            disableApp={disableApp}
            enableApp={enableApp}
            is_loading={is_loading}
        >
            <UnlinkPassword
                logoutClient={logoutClient}
                social_identity_provider={social_identity_provider}
                toggleResetPasswordModal={toggleResetPasswordModal}
                verification_code={unlink_verification_code || reset_verification_code}
                new_email={new_email}
            />
        </Dialog>
    );
});

export default UnlinkPasswordModal;
