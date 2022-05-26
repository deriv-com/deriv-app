import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { Button, Dialog, Text, Input } from '@deriv/components';
import { validEmail, getErrorMessages } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { SentEmailModal } from '@deriv/account';
import { WS } from 'Services';

const ResetEmailModal = ({
    disableApp,
    enableApp,
    is_loading,
    is_visible,
    verification_code,
    toggleResetEmailModal,
}) => {
    const [is_send_email_modal_open, setIsSendEmailModalOpen] = React.useState(false);
    const [email_request, setEmailRequest] = React.useState(null);

    const onResetComplete = (error_msg, actions) => {
        actions.setSubmitting(false);
        // Error would be returned on invalid token (and the like) cases.
        if (error_msg) {
            actions.resetForm({ email: '' });
            actions.setStatus({ error_msg });
            return;
        }

        actions.setStatus({ reset_complete: true });
        setIsSendEmailModalOpen(true);
        toggleResetEmailModal(false);
    };

    const handleSubmit = (values, actions) => {
        const api_request = {
            change_email: 'verify',
            new_email: values.email,
            verification_code,
        };

        setEmailRequest(api_request);

        WS.changeEmail(api_request).then(async response => {
            if (response.error) {
                onResetComplete(response.error.message, actions);
            } else {
                onResetComplete(null, actions);
            }
        });
    };

    const resendEmail = () => {
        WS.changeEmail(email_request);
    };

    const validateReset = values => {
        const errors = {};

        if (!values.email) {
            errors.email = localize('The email input should not be empty.');
        } else if (!validEmail(values.email)) {
            errors.email = getErrorMessages().email();
        }

        return errors;
    };

    const reset_initial_values = { email: '' };

    if (is_send_email_modal_open) {
        return (
            <SentEmailModal
                is_open={is_send_email_modal_open}
                onClose={() => setIsSendEmailModalOpen(false)}
                identifier_title={'Change_Email'}
                onClickSendEmail={resendEmail}
                has_live_chat={true}
                is_modal_when_mobile={true}
            />
        );
    }

    return (
        <Formik
            initialValues={reset_initial_values}
            initialStatus={{ reset_complete: false, error_msg: '' }}
            validate={validateReset}
            onSubmit={handleSubmit}
        >
            {({ errors, values, touched, isSubmitting, handleChange, setFieldTouched, status }) => (
                <Dialog
                    is_visible={is_visible}
                    disableApp={disableApp}
                    enableApp={enableApp}
                    is_loading={is_loading}
                    dismissable={status.error_msg}
                    onConfirm={() => toggleResetEmailModal(false)}
                    is_closed_on_cancel={false}
                >
                    <div className='reset-email'>
                        <Form>
                            <React.Fragment>
                                {status.reset_complete ? (
                                    <div className='reset-email__email-selection'>
                                        <Text as='p' weight='bold' className='reset-email__heading'>
                                            <Localize i18n_default_text='Your password has been changed' />
                                        </Text>
                                        <Text align='center' as='p' size='xxs' className='reset-email__subtext'>
                                            <Localize i18n_default_text='We will now redirect you to the login page.' />
                                        </Text>
                                    </div>
                                ) : (
                                    <div className='reset-email__email-selection'>
                                        <Text as='p' align='left' weight='bold' className='reset-email__heading'>
                                            <Localize i18n_default_text='Enter a new email address' />
                                        </Text>
                                        <Text
                                            as='p'
                                            color='prominent'
                                            size='xs'
                                            align='left'
                                            className='reset-email__descripton'
                                        >
                                            <Localize i18n_default_text="You'll log in to your Deriv account with this email address." />
                                        </Text>
                                        <fieldset className='reset-email__fieldset'>
                                            <Input
                                                data-lpignore='true'
                                                type='text'
                                                name='email'
                                                id={'email'}
                                                placeholder={localize('Email address')}
                                                value={values.email}
                                                required
                                                disabled={false}
                                                error={(touched.email && errors.email) || status.error_msg}
                                                onChange={e => {
                                                    setFieldTouched('email', true);
                                                    handleChange(e);
                                                }}
                                            />
                                        </fieldset>
                                        <Button
                                            className={classNames('reset-email__btn', {
                                                'reset-email__btn--disabled':
                                                    !values.email || errors.email || isSubmitting,
                                            })}
                                            type='submit'
                                            is_disabled={!values.email || !!errors.email || isSubmitting}
                                            primary
                                            large
                                        >
                                            <Localize i18n_default_text='Confirm' />
                                        </Button>
                                    </div>
                                )}
                            </React.Fragment>
                        </Form>
                    </div>
                </Dialog>
            )}
        </Formik>
    );
};

ResetEmailModal.propTypes = {
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
    is_visible: ui.is_reset_email_modal_visible,
    logoutClient: client.logout,
    toggleResetEmailModal: ui.toggleResetEmailModal,
    verification_code: client.verification_code.request_email,
}))(ResetEmailModal);
