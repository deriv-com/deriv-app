import classNames from 'classnames';
import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { VerifyEmailResponse } from '@deriv/api-types';
import { Button, Dialog, Icon, Input, Text } from '@deriv/components';
import { WS, getErrorMessages, validEmail } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';

type TLinkExpiredFormProps = {
    email: string;
};

type TVerifyEmailResponseError = {
    error: {
        message: string;
    };
};

const LinkExpiredModal = observer(() => {
    const { ui } = useStore();
    const { enableApp, disableApp, is_link_expired_modal_visible: is_visible, toggleLinkExpiredModal } = ui;

    const [is_email_sent, setIsEmailSent] = React.useState(false);

    const handleSubmit = (values: TLinkExpiredFormProps, actions: FormikHelpers<TLinkExpiredFormProps>) => {
        WS.verifyEmail(values.email, 'reset_password').then(
            async (response: VerifyEmailResponse & TVerifyEmailResponseError) => {
                actions.setSubmitting(false);
                if (response?.error) {
                    actions.resetForm();
                    actions.setStatus({ error_msg: response?.error?.message });
                } else {
                    setIsEmailSent(true);
                }
            }
        );
    };

    const handleValidate = (values: TLinkExpiredFormProps) => {
        if (!validEmail(values.email)) {
            return { email: getErrorMessages().email() };
        }
        return {};
    };

    const handleClose = () => toggleLinkExpiredModal(false);

    const getDialogTitle = () => (is_email_sent ? '' : localize('Link Expired'));

    const initial_values = { email: '' };

    return (
        <Formik
            initialValues={initial_values}
            initialStatus={{ error_msg: '' }}
            validate={handleValidate}
            onSubmit={handleSubmit}
        >
            {({ handleBlur, handleChange, errors, values, touched, isSubmitting, status, setStatus }) => (
                <Dialog
                    className={classNames('link-expired__spaced-container', {
                        'link-expired__spaced-container__fullscreen': is_email_sent,
                    })}
                    is_visible={is_visible}
                    disableApp={disableApp}
                    enableApp={enableApp}
                    title={getDialogTitle()}
                    has_close_icon
                    is_closed_on_cancel={true}
                    onConfirm={() => toggleLinkExpiredModal(false)}
                >
                    <div className='link-expired'>
                        <Form>
                            {is_email_sent ? (
                                <div className='link-expired__spaced-container__content link-expired__spaced-container__email_sent'>
                                    <Icon icon='IcEmailVerificationResent' size={128} />
                                    <Text as='p' size='s' align='center'>
                                        <Localize
                                            i18n_default_text='<0>We’ve sent you an email.</0>'
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
                                            id={'email'}
                                            onChange={e => {
                                                setStatus({ error_msg: '' });
                                                handleChange(e);
                                            }}
                                            onBlur={handleBlur}
                                            error={(touched.email && errors.email) || status.error_msg}
                                            label={localize('Email address')}
                                            value={values.email}
                                        />
                                    </fieldset>
                                    <div className='link-expired__spaced-container__button_container'>
                                        <Button secondary large onClick={handleClose}>
                                            <Localize i18n_default_text='Close' />
                                        </Button>
                                        <Button
                                            type='submit'
                                            primary
                                            large
                                            is_disabled={!values.email || !!errors.email || isSubmitting}
                                            is_loading={isSubmitting}
                                        >
                                            <Localize i18n_default_text='Resend email' />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Form>
                    </div>
                </Dialog>
            )}
        </Formik>
    );
});

export default LinkExpiredModal;
