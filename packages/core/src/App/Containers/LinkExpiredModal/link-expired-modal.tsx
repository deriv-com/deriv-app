import classNames from 'classnames';
import { useFormik } from 'formik';
import React from 'react';
import { Dialog, FormSubmitButton, Input, Text } from '@deriv/components';
import { useVerifyEmail } from '@deriv/hooks';
import { getErrorMessages, validEmail } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import EmailResent from './email-resent';

const LinkExpiredModal = observer(() => {
    const { ui, client } = useStore();
    const { setPreventRedirectToHub } = client;
    const { enableApp, disableApp, is_link_expired_modal_visible: is_visible, toggleLinkExpiredModal } = ui;

    const { send, error: verify_error, data: verify_data } = useVerifyEmail('reset_password');
    const [is_email_sent, setIsEmailSent] = React.useState(false);

    const formik = useFormik({
        initialValues: { email: '' },
        initialStatus: { error_msg: '' },
        validate: values => (!validEmail(values.email) ? { email: getErrorMessages().email() } : {}),
        onSubmit: values => send(values.email),
    });
    const {
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        resetForm,
        setStatus,
        setSubmitting,
        status,
        touched,
        values,
    } = formik;

    React.useEffect(() => {
        if (verify_data) {
            setSubmitting(false);
            setIsEmailSent(true);
        }
    }, [verify_data, setSubmitting]);

    React.useEffect(() => {
        if (verify_error && typeof verify_error === 'object' && 'message' in verify_error) {
            resetForm();
            setStatus({ error_msg: verify_error?.message });
        }
    }, [verify_error, resetForm, setStatus]);

    return (
        <form onSubmit={handleSubmit}>
            <Dialog
                className={classNames('link-expired__spaced-container', {
                    'link-expired__spaced-container__fullscreen': is_email_sent,
                })}
                is_visible={is_visible}
                disableApp={disableApp}
                enableApp={enableApp}
                title={is_email_sent ? '' : localize('Link expired')}
                has_close_icon
                onConfirm={() => {
                    toggleLinkExpiredModal(false);
                    setPreventRedirectToHub(false);
                }}
            >
                <div className='link-expired'>
                    {is_email_sent ? (
                        <EmailResent />
                    ) : (
                        <div className='link-expired__spaced-container__content'>
                            <Text as='p' size='xs' align='left'>
                                <Localize
                                    i18n_default_text='The link you clicked has expired. Ensure to click the link in the latest email in your inbox. Alternatively, enter your email below and click <0>Resend email</0> for a new link.'
                                    components={[<strong key={0} />]}
                                />
                            </Text>
                            <fieldset className='email-platform__content__fieldset'>
                                <Input
                                    className='email-input'
                                    data-lpignore='true'
                                    type='text'
                                    name='email'
                                    id='email'
                                    onChange={e => {
                                        setStatus({ error_msg: '' });
                                        handleChange(e);
                                    }}
                                    disabled={isSubmitting}
                                    onBlur={handleBlur}
                                    error={(touched.email && errors.email) || status.error_msg}
                                    label={localize('Email address')}
                                    value={values.email}
                                />
                            </fieldset>
                            <FormSubmitButton
                                has_cancel
                                cancel_label={localize('Close')}
                                onCancel={() => {
                                    toggleLinkExpiredModal(false);
                                    setPreventRedirectToHub(false);
                                }}
                                is_disabled={!values.email || !!errors.email || isSubmitting}
                                is_loading={isSubmitting}
                                label={localize('Resend email')}
                            />
                        </div>
                    )}
                </div>
            </Dialog>
        </form>
    );
});

export default LinkExpiredModal;
