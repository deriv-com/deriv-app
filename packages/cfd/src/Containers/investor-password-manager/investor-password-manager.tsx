import React from 'react';
import { Field, Form, Formik, FieldProps } from 'formik';
import { PasswordInput, PasswordMeter, Text, Button } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { getErrorMessages } from '@deriv/shared';
import CFDPasswordSuccessMessage from './cfd-password-success-message';
import { TMultiStepRefProps, TPasswordManagerModalFormValues } from '../props.types';

type TInvestorPasswordManagerProps = {
    error_message_investor: string;
    is_submit_success_investor: boolean;
    multi_step_ref: React.MutableRefObject<TMultiStepRefProps | undefined>;
    onSubmit: (values: TPasswordManagerModalFormValues) => Promise<void>;
    setPasswordType: (value: string) => void;
    toggleModal: () => void;
    validatePassword: (values: { old_password: string; new_password: string; password_type: string }) => void | object;
};

const InvestorPasswordManager = ({
    error_message_investor,
    is_submit_success_investor,
    multi_step_ref,
    onSubmit,
    setPasswordType,
    toggleModal,
    validatePassword,
}: TInvestorPasswordManagerProps) => {
    if (is_submit_success_investor) {
        return <CFDPasswordSuccessMessage toggleModal={toggleModal} is_investor />;
    }

    const type_investor = 'investor';

    const initial_values = { old_password: '', new_password: '', password_type: `${type_investor}` };

    return (
        <div className='cfd-password-manager__investor-wrapper'>
            <Text as='p' size='xs' className='cfd-password-manager--paragraph'>
                <Localize i18n_default_text='Use this password to grant viewing access to another user. While they may view your trading account, they will not be able to trade or take any other actions.' />
            </Text>
            <Text as='p' size='xs' className='cfd-password-manager--paragraph'>
                <Localize i18n_default_text='If this is the first time you try to create a password, or you have forgotten your password, please reset it.' />
            </Text>
            {error_message_investor && (
                <Text
                    as='p'
                    color='loss-danger'
                    size='xs'
                    className='cfd-password-manager--error-message'
                    data-testid='dt_error_message_investor'
                >
                    {error_message_investor}
                </Text>
            )}
            <Formik initialValues={initial_values} validate={validatePassword} onSubmit={onSubmit}>
                {({ isSubmitting, errors, setFieldTouched, values, touched }) => (
                    <Form className='cfd-password-manager__investor-form' noValidate>
                        <Field name='old_password'>
                            {({ field }: FieldProps<string, TPasswordManagerModalFormValues>) => (
                                <PasswordInput
                                    {...field}
                                    autoComplete='current-password'
                                    label={localize('Current investor password')}
                                    error={touched.old_password && errors.old_password}
                                    required
                                />
                            )}
                        </Field>
                        <Field name='new_password'>
                            {({ field }: FieldProps<string, TPasswordManagerModalFormValues>) => (
                                <PasswordMeter
                                    input={field.value}
                                    has_error={!!(touched.new_password && errors.new_password)}
                                    custom_feedback_messages={getErrorMessages().password_warnings}
                                >
                                    {({ has_warning }: { has_warning: boolean }) => (
                                        <PasswordInput
                                            {...field}
                                            autoComplete='new-password'
                                            label={localize('New investor password')}
                                            hint={
                                                !has_warning &&
                                                localize(
                                                    'Strong passwords contain at least 8 characters, combine uppercase and lowercase letters and numbers.'
                                                )
                                            }
                                            error={touched.new_password && errors.new_password}
                                            onChange={(e: React.FormEvent<HTMLInputElement>) => {
                                                setFieldTouched('new_password', true, true);
                                                field.onChange(e);
                                            }}
                                            className='cfd-password-manager__new-password'
                                            required
                                        />
                                    )}
                                </PasswordMeter>
                            )}
                        </Field>
                        <div className='cfd-password-manager__actions'>
                            <Button
                                className='cfd-password-manager--button'
                                is_disabled={
                                    isSubmitting ||
                                    !values.old_password ||
                                    !values.new_password ||
                                    Object.keys(errors).length > 0
                                }
                                is_loading={isSubmitting}
                                text={localize('Change investor password')}
                                primary
                                large
                            />
                            <Button
                                className='cfd-password-manager--button'
                                type='button'
                                onClick={() => {
                                    setPasswordType('investor');
                                    multi_step_ref.current?.goNextStep();
                                }}
                                text={localize('Create or reset investor password')}
                                tertiary
                                large
                            />
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default InvestorPasswordManager;
