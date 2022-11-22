/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik } from 'formik';
import React from 'react';
import { observer } from 'mobx-react-lite';

import { FormSubmitButton, Modal, PasswordInput, PasswordMeter, Text } from '@deriv/components';
import { isMobile, validLength, validPassword, getErrorMessages, getLegalEntityName } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { useStores } from 'Stores';
import './cfd-password-modal.scss';

type TCFDPasswordFormProps = {
    validatePassword: any;
    submitMt5Password: any;
    is_real_financial_stp: boolean;
    jurisdiction_selected_shortcode: string;
    closeModal: any;
    form_error?: any;
    account_title: any;
};

const CFDPasswordForm = ({ ...props }: TCFDPasswordFormProps) => (
    <Formik
        initialValues={{
            password: '',
        }}
        validate={props.validatePassword}
        onSubmit={(values, actions) => {
            props.submitMt5Password(values.password, actions.setSubmitting);
        }}
    >
        {({
            handleSubmit,
            // setFieldValue,
            setFieldTouched,
            handleChange,
            handleBlur,
            errors,
            values,
            isSubmitting,
            touched,
        }) => (
            <form onSubmit={handleSubmit}>
                <div className='cfd-password-modal__content'>
                    <div className='dc-modal__container_cfd-password-modal__body'>
                        <div className='input-element'>
                            <PasswordMeter
                                input={values.password}
                                has_error={!!(touched.password && errors.password)}
                                custom_feedback_messages={getErrorMessages().password_warnings}
                            >
                                {({ has_warning }: { has_warning: boolean }) => (
                                    <PasswordInput
                                        autoComplete='new-password'
                                        label={localize('Create a password')}
                                        error={touched.password && errors.password}
                                        hint={
                                            !has_warning &&
                                            localize(
                                                'Minimum of eight lower and uppercase English letters with numbers'
                                            )
                                        }
                                        name='password'
                                        value={values.password}
                                        onBlur={handleBlur}
                                        onChange={(e: Event) => {
                                            setFieldTouched('password', true);
                                            handleChange(e);
                                        }}
                                    />
                                )}
                            </PasswordMeter>
                        </div>
                        <Text align='center' size='xxs' styles={{ padding: '0 1rem' }}>
                            <Localize i18n_default_text='To get an Deriv MT5 app, we need to confirm your account password. We do this to protect your account against unauthorized action.' />
                        </Text>
                        {props.is_real_financial_stp && (
                            <div className='dc-modal__container_cfd-password-modal__description'>
                                <Localize
                                    i18n_default_text='Your MT5 Financial STP account will be opened through {{legal_entity_name}}. All trading in this account is subject to the regulations and guidelines of the Labuan Financial Services Authority (LFSA). All other accounts, including your Deriv account, are not subject to the regulations and guidelines of the Labuan Financial Services Authority (LFSA).'
                                    values={{
                                        legal_entity_name: getLegalEntityName('fx'),
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className='dc-modal__container_cfd-password-modal__footer'>
                    <FormSubmitButton
                        is_disabled={isSubmitting || !values.password || Object.keys(errors).length > 0}
                        has_cancel
                        cancel_label={localize('Reset password')}
                        onCancel={props.closeModal}
                        is_absolute={isMobile()}
                        is_loading={isSubmitting}
                        label={localize('Next')}
                        form_error={props.form_error}
                    />
                </div>
            </form>
        )}
    </Formik>
);

const CFDPasswordModal = () => {
    const { client, ui } = useStores();
    // TODO: add cfd to store
    const cfd: any = {};
    const {
        account_title,
        account_type,
        disableCFDPasswordModal,
        has_cfd_error,
        is_cfd_success_dialog_enabled,
        is_cfd_password_modal_enabled,
        jurisdiction_selected_shortcode,
        setError,
        setCFDSuccessDialog,
    } = cfd;

    const { email_address } = client;
    const { enableGetPasswordModal } = ui;

    const validatePassword = (values: { password: string }) => {
        const errors: {
            password?: string;
        } = {};

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
        if (values.password.toLowerCase() === email_address?.toLowerCase()) {
            errors.password = localize('Your password cannot be the same as your email address.');
        }

        return errors;
    };

    const closeDialogs = () => {
        setCFDSuccessDialog(false);
        setError(false);
    };

    const closeModal = () => {
        closeDialogs();
        disableCFDPasswordModal();
    };

    const submit = () => {
        disableCFDPasswordModal();
        setTimeout(() => {
            enableGetPasswordModal();
        }, 900);
    };

    const should_show_password = is_cfd_password_modal_enabled && !has_cfd_error && !is_cfd_success_dialog_enabled;
    const is_real_financial_stp = [account_type.category, account_type.type].join('_') === 'real_financial_stp';

    return (
        <Modal
            className='cfd-password-modal'
            is_open={should_show_password}
            toggleModal={closeModal}
            title={localize('Confirm your account password')}
            has_close_icon
        >
            <CFDPasswordForm
                account_title={account_title}
                closeModal={closeModal}
                submitMt5Password={submit}
                is_real_financial_stp={is_real_financial_stp}
                jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                validatePassword={validatePassword}
            />
        </Modal>
    );
};

export default observer(CFDPasswordModal);
