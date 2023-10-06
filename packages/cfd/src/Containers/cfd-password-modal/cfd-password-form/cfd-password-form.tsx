import React from 'react';
import { Formik, FormikErrors } from 'formik';
import { getLegalEntityName, getErrorMessages, getCFDPlatformLabel, CFD_PLATFORMS, CFD_text } from '@deriv/shared';
import { Text, FormSubmitButton, PasswordMeter, PasswordInput } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import {
    getDxCompanies,
    getFormattedJurisdictionCode,
    TDxCompanies,
} from '../../../Stores/Modules/CFD/Helpers/cfd-config';
import { TCFDPasswordFormReusedProps, TCFDPasswordFormValues, TOnSubmitPassword } from '../../props.types';
import { ACCOUNT_CATEGORY, PASSWORD_ERRORS } from '../../../Constants/cfd-password-modal-constants';
import PasswordStep from './password-step';
import { observer, useStore } from '@deriv/stores';

type TCFDPasswordFormProps = TCFDPasswordFormReusedProps & {
    account_title: string;
    account_type: {
        category?: string;
        type?: string;
    };
    closeModal: () => void;
    error_type?: string;
    form_error?: string;
    has_mt5_account: boolean;
    is_bvi: boolean;
    is_dxtrade_allowed: boolean;
    is_real_financial_stp: boolean;
    jurisdiction_selected_shortcode: string;
    onCancel: () => void;
    onForgotPassword: () => void;
    should_set_trading_password: boolean;
    show_eu_related_content: boolean;
    submitPassword: TOnSubmitPassword;
};

const CFDPasswordForm = observer(
    ({
        account_title,
        account_type,
        closeModal,
        error_message,
        error_type,
        form_error,
        has_mt5_account,
        is_real_financial_stp,
        jurisdiction_selected_shortcode,
        onCancel,
        onForgotPassword,
        platform,
        should_set_trading_password,
        show_eu_related_content,
        submitPassword,
        validatePassword,
    }: TCFDPasswordFormProps) => {
        const { ui } = useStore();
        const { is_mobile } = ui;

        const button_label = React.useMemo(() => {
            if (error_type === PASSWORD_ERRORS.RESET) {
                return localize('Try later');
            }
            return localize('Add account');
        }, [error_type]);

        const getCancelButtonLabel = ({
            should_set_trading_password,
            error_type,
        }: Pick<TCFDPasswordFormProps, 'should_set_trading_password' | 'error_type'>) => {
            if (should_set_trading_password && error_type !== PASSWORD_ERRORS.RESET) {
                return is_mobile ? localize('Cancel') : null;
            }

            return localize('Forgot password?');
        };

        const has_cancel_button =
            !is_mobile && (!should_set_trading_password || error_type !== PASSWORD_ERRORS.PASSWORD);

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

        const getAccountTitle = () => {
            if (platform === CFD_PLATFORMS.DXTRADE) {
                return getDxCompanies()[account_type.category as keyof TDxCompanies][
                    account_type.type as keyof TDxCompanies['demo' | 'real']
                ].short_title;
            }

            return account_title;
        };

        const handlePasswordInputChange = (
            e: React.ChangeEvent<HTMLInputElement>,
            handleChange: (el: React.ChangeEvent<HTMLInputElement>) => void,
            validateForm: (values?: TCFDPasswordFormValues) => Promise<FormikErrors<TCFDPasswordFormValues>>,
            setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void
        ) => {
            handleChange(e);
            validateForm().then(() => {
                setFieldTouched('password', true);
            });
        };

        if (error_type === PASSWORD_ERRORS.RESET) {
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
                <PasswordStep
                    platform={platform}
                    error_message={error_message}
                    validatePassword={validatePassword}
                    submitPassword={submitPassword}
                    has_mt5_account={has_mt5_account}
                    is_real_financial_stp={is_real_financial_stp}
                    handlePasswordInputChange={handlePasswordInputChange}
                />
            );
        }

        const showJurisdiction = () => {
            if (platform === CFD_PLATFORMS.DXTRADE) {
                return '';
            } else if (!show_eu_related_content) {
                return getFormattedJurisdictionCode(jurisdiction_selected_shortcode);
            }
            return CFD_text.cfd;
        };

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
                            {!should_set_trading_password && (
                                <Text size='xs' className='dc-modal__container_cfd-password-modal__account-title'>
                                    {account_type.category === ACCOUNT_CATEGORY.REAL && (
                                        <Localize
                                            i18n_default_text='Enter your {{platform}} password to add a {{platform_name}} {{account}} {{jurisdiction_shortcode}} account.'
                                            values={{
                                                platform: getCFDPlatformLabel(platform),
                                                platform_name:
                                                    platform === CFD_PLATFORMS.MT5
                                                        ? 'MT5'
                                                        : getCFDPlatformLabel(platform),
                                                account: !show_eu_related_content ? getAccountTitle() : '',
                                                jurisdiction_shortcode: showJurisdiction(),
                                            }}
                                        />
                                    )}
                                    {account_type.category === ACCOUNT_CATEGORY.DEMO && (
                                        <Localize
                                            i18n_default_text='Enter your {{platform}} password to add a {{platform_name}} {{account}} account.'
                                            values={{
                                                platform: getCFDPlatformLabel(platform),
                                                platform_name:
                                                    platform === CFD_PLATFORMS.MT5
                                                        ? 'MT5'
                                                        : getCFDPlatformLabel(platform),
                                                account: getAccountTitle(),
                                            }}
                                        />
                                    )}
                                </Text>
                            )}
                            {/* TODO: Check if do we have to add 'PasswordMeter' in production aswell. */}
                            <div className='input-element'>
                                <PasswordMeter
                                    input={values.password}
                                    has_error={!!(touched.password && errors.password)}
                                    custom_feedback_messages={getErrorMessages().password_warnings}
                                >
                                    <PasswordInput
                                        autoComplete='new-password'
                                        label={
                                            <Localize
                                                i18n_default_text='{{platform}} password'
                                                values={{
                                                    platform: getCFDPlatformLabel(platform),
                                                }}
                                            />
                                        }
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
                                </PasswordMeter>
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
                            {error_type === PASSWORD_ERRORS.ERROR && (
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
