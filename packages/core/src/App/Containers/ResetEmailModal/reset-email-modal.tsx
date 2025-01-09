import React from 'react';
import classNames from 'classnames';
import { Formik, Form, FormikErrors } from 'formik';
import { useHistory } from 'react-router-dom';
import { Button, Dialog, Text, Input } from '@deriv/components';
import { validEmail, getErrorMessages, loginUrl, routes } from '@deriv/shared';
import { Localize, localize, getLanguage } from '@deriv/translations';
import { ConfirmEmailModal } from '../ConfirmEmailModal/confirm-email-modal';
import { observer, useStore } from '@deriv/stores';

type TResetEmailInitValues = {
    email: string;
};

const ResetEmailModal = observer(() => {
    const { ui, client } = useStore();
    const history = useHistory();
    const { disableApp, enableApp, is_loading, is_reset_email_modal_visible: is_visible, toggleResetEmailModal } = ui;
    const { email, is_logged_in } = client;
    const [is_confirm_email_modal_open, setIsConfirmResetEmailModal] = React.useState(false);
    const [email_error_msg, setEmailErrorMsg] = React.useState('');
    const [email_value, setEmailValue] = React.useState('');

    const handleSubmit = (values: TResetEmailInitValues) => {
        setEmailValue(values.email);
        setIsConfirmResetEmailModal(true);
    };

    const validateReset = (values: TResetEmailInitValues) => {
        const errors: FormikErrors<TResetEmailInitValues> = {};

        if (!values.email) {
            errors.email = localize('The email input should not be empty.');
        } else if (!validEmail(values.email)) {
            errors.email = getErrorMessages().email();
        }

        return errors;
    };

    const reset_initial_values: TResetEmailInitValues = { email: email_value };

    if (is_confirm_email_modal_open) {
        return (
            <ConfirmEmailModal
                changed_email={email_value}
                is_open={is_confirm_email_modal_open}
                onClose={() => setIsConfirmResetEmailModal(false)}
                prev_email={email}
                setErrorMessage={setEmailErrorMsg}
                setEmailValue={setEmailValue}
            />
        );
    }
    const onCancel = () => {
        toggleResetEmailModal(false);
        if (is_logged_in) {
            history.push(routes.passwords);
        } else {
            window.location.href = loginUrl({ language: getLanguage() });
        }
    };
    return (
        <Formik
            initialValues={reset_initial_values}
            initialStatus={{ reset_complete: false, error_msg: '' }}
            validate={validateReset}
            onSubmit={handleSubmit}
        >
            {({ errors, values, touched, isSubmitting, handleBlur, handleChange, setFieldTouched, status }) => (
                <Dialog
                    is_visible={is_visible}
                    disableApp={disableApp}
                    enableApp={enableApp}
                    is_loading={is_loading}
                    dismissable={status.error_msg || email_error_msg}
                    onConfirm={() => toggleResetEmailModal(false)}
                    is_closed_on_cancel={false}
                    has_close_icon={!!errors.email || !!email_error_msg}
                    onClose={onCancel}
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
                                                error={(touched.email && errors.email) || email_error_msg}
                                                onBlur={handleBlur}
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
                                            is_disabled={
                                                !values.email || !!errors.email || isSubmitting || !!email_error_msg
                                            }
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
