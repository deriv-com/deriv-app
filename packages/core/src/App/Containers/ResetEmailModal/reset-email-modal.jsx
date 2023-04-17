import React from 'react';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { Button, Dialog, Text, Input } from '@deriv/components';
import { validEmail, getErrorMessages } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { ConfirmEmailModal } from '../ConfirmEmailModal/confirm-email-modal.jsx';
import { observer, useStore } from '@deriv/stores';

const ResetEmailModal = observer(() => {
    const { ui, client } = useStore();
    const { disableApp, enableApp, is_loading, is_reset_email_modal_visible: is_visible, toggleResetEmailModal } = ui;
    const { is_social_signup, email } = client;
    const verification_code = client.verification_code.request_email;
    const [is_confirm_email_modal_open, setIsConfirmResetEmailModal] = React.useState(false);
    const [email_error_msg, setEmailErrorMsg] = React.useState(null);
    const [new_email, setNewEmail] = React.useState(null);

    const handleSubmit = values => {
        setNewEmail(values.email);
        setIsConfirmResetEmailModal(true);
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

    if (is_confirm_email_modal_open) {
        return (
            <ConfirmEmailModal
                changed_email={new_email}
                is_open={is_confirm_email_modal_open}
                onClose={() => setIsConfirmResetEmailModal(false)}
                prev_email={email}
                setErrorMessage={setEmailErrorMsg}
                verification_code={verification_code}
                is_social_signup={is_social_signup}
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
                                                error={(touched.email && errors.email) || email_error_msg}
                                                onChange={e => {
                                                    setEmailErrorMsg('');
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
});

export default ResetEmailModal;
