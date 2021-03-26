import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { Button, Dialog, Icon, PasswordInput, PasswordMeter, Text } from '@deriv/components';
import { getErrorMessages, validPassword, validLength } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { WS } from 'Services/index';

const ResetTradingPassword = ({ toggleResetTradingPasswordModal, verification_code }) => {
    const onResetComplete = (error_msg, actions) => {
        actions.setSubmitting(false);
        actions.resetForm({ password: '' });
        // Error would be returned on invalid token (and the like) cases.
        // TODO: Proper error handling (currently we have no place to put the message)
        if (error_msg) {
            actions.setStatus({ error_msg });
            return;
        }
        actions.setStatus({ reset_complete: true });
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
        <div className='reset-trading-password'>
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
                                <div className='reset-trading-password__password-success'>
                                    <Icon
                                        className='reset-trading-password__icon'
                                        icon='IcSuccessResetTradingPassword'
                                        size={128}
                                    />
                                    <Text as='p' weight='bold' className='reset-trading-password__heading'>
                                        <Localize i18n_default_text='Success' />
                                    </Text>
                                    <Text align='center' as='p' size='xs' className='reset-trading-password__subtext'>
                                        {localize(
                                            'You have a new trading password. Use this to log in to Deriv MT5 and Deriv X.'
                                        )}
                                    </Text>
                                    <Button
                                        type='button'
                                        onClick={() => toggleResetTradingPasswordModal(false)}
                                        primary
                                        large
                                    >
                                        <Localize i18n_default_text='Done' />
                                    </Button>
                                </div>
                            ) : (
                                <div className='reset-trading-password__set-password'>
                                    <Text as='p' weight='bold' className='reset-trading-password__heading'>
                                        <Localize i18n_default_text='Set new trading password' />
                                    </Text>
                                    <fieldset className='reset-trading-password__input-field'>
                                        <PasswordMeter
                                            input={values.password}
                                            has_error={!!(touched.password && errors.password)}
                                            custom_feedback_messages={getErrorMessages().password_warnings}
                                        >
                                            <PasswordInput
                                                autoComplete='new-password'
                                                className='reset-trading-password__password-field'
                                                name='password'
                                                label={localize('Trading password')}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.password && errors.password}
                                                value={values.password}
                                                data-lpignore='true'
                                                required
                                            />
                                        </PasswordMeter>
                                    </fieldset>
                                    <Text as='p' size='xs' className='reset-trading-password__hint'>
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
                                        className={classNames('reset-trading-password__btn', {
                                            'reset-trading-password__btn--disabled':
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

ResetTradingPassword.propTypes = {
    toggleResetTradingPasswordModal: PropTypes.func,
    verification_code: PropTypes.string,
};

const ResetTradingPasswordModal = ({
    disableApp,
    enableApp,
    is_loading,
    is_visible,
    toggleResetTradingPasswordModal,
    verification_code,
}) => {
    return (
        <Dialog
            className='reset-trading-password__dialog'
            is_visible={is_visible}
            disableApp={disableApp}
            enableApp={enableApp}
            is_loading={is_loading}
        >
            <ResetTradingPassword
                toggleResetTradingPasswordModal={toggleResetTradingPasswordModal}
                verification_code={verification_code}
            />
        </Dialog>
    );
};

ResetTradingPasswordModal.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    is_loading: PropTypes.bool,
    is_visible: PropTypes.bool,
    toggleResetTradingPasswordModal: PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(({ ui, client }) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_loading: ui.is_loading,
    is_visible: ui.is_reset_trading_password_modal_visible,
    toggleResetTradingPasswordModal: ui.toggleResetTradingPasswordModal,
    verification_code: client.verification_code.reset_password,
}))(ResetTradingPasswordModal);
