import classNames from 'classnames';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { Dialog, FormSubmitButton, Icon, Input, Text } from '@deriv/components';
import { useVerifyEmail } from '@deriv/hooks';
import { getErrorMessages, validEmail } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';

const LinkExpiredModal = observer(() => {
    const { ui } = useStore();
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

    useEffect(() => {
        if (verify_data) {
            setSubmitting(false);
            setIsEmailSent(true);
        }
    }, [verify_data, setSubmitting]);

    useEffect(() => {
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
                title={is_email_sent ? '' : localize('Link Expired')}
                has_close_icon
                onConfirm={() => toggleLinkExpiredModal(false)}
            >
                <div className='link-expired'>
                    {is_email_sent ? (
                        <div className='link-expired__spaced-container__content link-expired__spaced-container__email_sent'>
                            <Icon icon='IcEmailVerificationResent' size={128} />
                            <Text as='p' size='s' align='center'>
                                <Localize
                                    i18n_default_text="<0>We've sent you an email.</0>"
                                    components={[<strong key={0} />]}
                                />
                            </Text>
                            <Text as='p' size='s' align='center'>
                                <Localize i18n_default_text='Please click on the link in the email to reset your password.' />
                            </Text>
                        </div>
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
                            <div className='link-expired__spaced-container__button_container'>
                                <FormSubmitButton
                                    has_cancel
                                    cancel_label={localize('Close')}
                                    onCancel={() => toggleLinkExpiredModal(false)}
                                    is_disabled={!values.email || !!errors.email || isSubmitting}
                                    is_loading={isSubmitting}
                                    label={localize('Resend email')}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </Dialog>
        </form>
    );
});

export default LinkExpiredModal;
