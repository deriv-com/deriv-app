import { Formik, FormikErrors } from 'formik';
import React from 'react';
import { Text, Icon, PasswordMeter, PasswordInput, FormSubmitButton } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { getCFDPlatformLabel, getErrorMessages } from '@deriv/shared';
import { TCFDPasswordFormReusedProps, TCFDPasswordFormValues, TOnSubmitPassword } from './types';
import { CFD_PLATFORMS } from 'Helpers/cfd-config';

type TCFDCreatePasswordProps = TCFDPasswordFormReusedProps & {
    password: string;
    onSubmit: TOnSubmitPassword;
    is_real_financial_stp: boolean;
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

export const CreatePassword = ({
    password,
    platform,
    validatePassword,
    onSubmit,
    error_message,
    is_real_financial_stp,
}: TCFDCreatePasswordProps) => {
    return (
        <Formik
            initialValues={{
                password,
            }}
            enableReinitialize
            validate={validatePassword}
            onSubmit={onSubmit}
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
                    <div
                        className='cfd-password-modal__content dc-modal__container_cfd-password-modal__body cfd-password-modal__create-password-content'
                        data-testid='dt_create_password'
                    >
                        <Icon
                            icon={platform === CFD_PLATFORMS.MT5 ? 'IcMt5OnePassword' : 'IcDxtradeOnePassword'}
                            width='122'
                            height='108'
                        />
                        <Text
                            size='s'
                            align='center'
                            weight='bold'
                            className='cfd-password-modal__create-password-title'
                        >
                            <Localize
                                i18n_default_text='Create a {{platform}} password'
                                values={{
                                    platform: getCFDPlatformLabel(platform),
                                }}
                            />
                        </Text>
                        <Text size='xs' align='center' className='cfd-password-modal__create-password-description'>
                            <Localize
                                i18n_default_text='You can use this password for all your {{platform}} accounts.'
                                values={{
                                    platform: getCFDPlatformLabel(platform),
                                }}
                            />
                        </Text>
                        <div className='input-element'>
                            <PasswordMeter
                                input={values.password}
                                has_error={!!(touched.password && errors.password)}
                                custom_feedback_messages={getErrorMessages().password_warnings}
                            >
                                {() => (
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
                                )}
                            </PasswordMeter>
                        </div>
                        {is_real_financial_stp && (
                            <div className='dc-modal__container_cfd-password-modal__description'>
                                <Localize i18n_default_text='Your MT5 Financial STP account will be opened through Deriv (FX) Ltd. All trading in this account is subject to the regulations and guidelines of the Labuan Financial Service Authority (LFSA). None of your other accounts, including your Deriv account, is subject to the regulations and guidelines of the Labuan Financial Service Authority (LFSA).' />
                            </div>
                        )}
                        <FormSubmitButton
                            is_disabled={!values.password || Object.keys(errors).length > 0}
                            is_loading={isSubmitting}
                            label={localize('Create {{platform}} password', {
                                platform: getCFDPlatformLabel(platform),
                            })}
                            is_center={true}
                        />
                    </div>
                </form>
            )}
        </Formik>
    );
};
