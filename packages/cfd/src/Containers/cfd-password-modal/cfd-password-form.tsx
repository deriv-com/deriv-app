import React from 'react';
import { Formik } from 'formik';

import { FormSubmitButton, PasswordInput, Text } from '@deriv/components';
import { getCFDPlatformLabel, getLegalEntityName, isDesktop } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';

import CFDPasswordModalTitle from './cfd-password-modal-title';
import getCancelButtonLabel from './get-cancel-button-label';
import CFDCreatePasswordForm from './cfd-create-password-form';
import handlePasswordInputChange from './handle-password-input-change';

import '../../sass/cfd.scss';

import { TCFDPasswordFormProps } from './cfd-password-modal.types';

const CFDPasswordForm = observer(
    ({
        closeModal,
        error_message,
        error_type,
        form_error,
        has_mt5_account,
        is_real_financial_stp,
        onCancel,
        onForgotPassword,
        platform,
        should_set_trading_password,
        submitPassword,
        validatePassword,
    }: TCFDPasswordFormProps) => {
        const { ui } = useStore();
        const { is_mobile } = ui;

        const button_label = React.useMemo(() => {
            if (error_type === 'PasswordReset') {
                return localize('Try later');
            }
            return localize('Add account');
        }, [error_type]);

        const has_cancel_button = (isDesktop() ? !should_set_trading_password : true) || error_type === 'PasswordReset';

        const cancel_button_label = getCancelButtonLabel({ should_set_trading_password, error_type });

        const handleCancel = () => {
            if (!has_cancel_button) {
                return undefined;
            }
            if (should_set_trading_password) {
                return onCancel();
            }

            return onForgotPassword();
        };

        if (error_type === 'PasswordReset') {
            return (
                <React.Fragment>
                    <div className='cfd-password-reset'>
                        <div className='cfd-password-modal__content cfd-password-modal__content--password-reset'>
                            <Text as='p' line_height='24' size='xs'>
                                <Localize i18n_default_text='Please try again in a minute.' />
                            </Text>
                        </div>
                        <Formik onSubmit={closeModal} initialValues={{}}>
                            {({ handleSubmit }) => (
                                <form onSubmit={handleSubmit}>
                                    <FormSubmitButton
                                        has_cancel={has_cancel_button}
                                        cancel_label={cancel_button_label}
                                        onCancel={handleCancel}
                                        is_absolute={is_mobile}
                                        label={button_label}
                                    />
                                </form>
                            )}
                        </Formik>
                    </div>
                </React.Fragment>
            );
        }

        if (should_set_trading_password) {
            return (
                <CFDCreatePasswordForm
                    platform={platform}
                    error_message={error_message}
                    validatePassword={validatePassword}
                    submitPassword={submitPassword}
                    has_mt5_account={has_mt5_account}
                    is_real_financial_stp={is_real_financial_stp}
                />
            );
        }

        return (
            <Formik
                initialValues={{
                    password: '',
                }}
                enableReinitialize
                validate={validatePassword}
                onSubmit={submitPassword}
            >
                {({
                    errors,
                    isSubmitting,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    setFieldTouched,
                    touched,
                    values,
                    validateForm,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div className='cfd-password-modal__content dc-modal__container_cfd-password-modal__body'>
                            {!should_set_trading_password && <CFDPasswordModalTitle platform={platform} />}
                            <div className='input-element'>
                                <PasswordInput
                                    autoComplete='new-password'
                                    label={localize('{{platform}} password', {
                                        platform: getCFDPlatformLabel(platform),
                                    })}
                                    error={
                                        (touched.password && errors.password) ||
                                        (values.password.length === 0 ? error_message : '')
                                    }
                                    name='password'
                                    value={values.password}
                                    onBlur={handleBlur}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        handlePasswordInputChange(e, handleChange, validateForm, setFieldTouched);
                                    }}
                                    data_testId={`dt_${platform}_password`}
                                />
                            </div>

                            {is_real_financial_stp && (
                                <div className='dc-modal__container_cfd-password-modal__description'>
                                    <Localize
                                        i18n_default_text='Your MT5 Financial STP account will be opened through {{legal_entity_name}}. All trading in this account is subject to the regulations and guidelines of the Labuan Financial Service Authority (LFSA). None of your other accounts, including your Deriv account, is subject to the regulations and guidelines of the Labuan Financial Service Authority (LFSA).'
                                        values={{
                                            legal_entity_name: getLegalEntityName('fx'),
                                        }}
                                    />
                                </div>
                            )}
                            {error_type === 'PasswordError' && (
                                <Text size='xs' as='p' className='dc-modal__container_mt5-password-modal__hint'>
                                    <Localize
                                        i18n_default_text='Hint: You may have entered your Deriv password, which is different from your {{platform}} password.'
                                        values={{
                                            platform: getCFDPlatformLabel(platform),
                                        }}
                                    />
                                </Text>
                            )}
                        </div>
                        <FormSubmitButton
                            is_disabled={!values.password}
                            has_cancel={has_cancel_button}
                            cancel_label={cancel_button_label}
                            onCancel={handleCancel}
                            is_absolute={is_mobile}
                            is_loading={isSubmitting}
                            label={button_label}
                            is_center={should_set_trading_password}
                            form_error={form_error}
                        />
                    </form>
                )}
            </Formik>
        );
    }
);

export default CFDPasswordForm;
