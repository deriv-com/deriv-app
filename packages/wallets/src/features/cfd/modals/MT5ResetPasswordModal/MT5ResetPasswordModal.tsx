import React, { useState } from 'react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useTradingPlatformPasswordChange } from '@deriv/api-v2';
import {
    ModalStepWrapper,
    WalletButton,
    WalletButtonGroup,
    WalletPasswordFieldLazy,
    WalletText,
    WalletTextField,
} from '../../../../components';
import PasswordViewerIcon from '../../../../components/Base/WalletPasswordField/PasswordViewerIcon';
import { passwordRequirements } from '../../../../constants/password';
import useDevice from '../../../../hooks/useDevice';
import { validPasswordMT5 } from '../../../../utils/password-validation';
import { PlatformDetails } from '../../constants';
import './MT5ResetPasswordModal.scss';

type TFormInitialValues = {
    currentPassword: string;
    newPassword: string;
};

const MT5ResetPasswordModal = () => {
    const { error, isLoading, mutateAsync: tradingPasswordChange } = useTradingPlatformPasswordChange();
    const initialValues: TFormInitialValues = { currentPassword: '', newPassword: '' };
    const title = PlatformDetails.mt5.title;
    const { isMobile } = useDevice();
    const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
    const [hasCurrentPasswordFieldTouched, setHasCurrentPasswordFieldTouched] = useState(false);

    const validateCurrentPassword = (value: string) => {
        if (error) {
            if (error?.error?.code === 'PasswordError') {
                return error?.error?.message;
            }
        }
        if (!value) return 'The field is required';
    };

    const onFormSubmitHandler = async (values: TFormInitialValues) => {
        await tradingPasswordChange({
            new_password: values.newPassword,
            old_password: values.currentPassword,
            platform: PlatformDetails.mt5.platform,
        });
    };

    return (
        <ModalStepWrapper title={`${title} latest password requirements`}>
            <div className='wallets-mt5-reset'>
                <Formik initialValues={initialValues} onSubmit={onFormSubmitHandler}>
                    {({ handleChange, values }) => (
                        <Form>
                            <div className='wallets-mt5-reset__container'>
                                <div className='wallets-mt5-reset__content'>
                                    <WalletText size='sm'>
                                        To enhance your MT5 account security we have upgraded our password policy.
                                        <br />
                                        Please update your password accordingly.
                                    </WalletText>
                                    <div className='wallets-mt5-reset__fields'>
                                        <Field name='currentPassword' validate={validateCurrentPassword}>
                                            {({ field, form }: FieldProps) => {
                                                return (
                                                    <WalletTextField
                                                        autoComplete='current-password'
                                                        errorMessage={
                                                            hasCurrentPasswordFieldTouched && form.errors[field.name]
                                                        }
                                                        isInvalid={
                                                            hasCurrentPasswordFieldTouched &&
                                                            Boolean(form.errors[field.name])
                                                        }
                                                        label='Current password'
                                                        name={field.name}
                                                        onBlur={e => {
                                                            setHasCurrentPasswordFieldTouched(true);
                                                            field.onBlur(e);
                                                        }}
                                                        onChange={field.onChange}
                                                        renderRightIcon={() => (
                                                            <PasswordViewerIcon
                                                                setViewPassword={setIsCurrentPasswordVisible}
                                                                viewPassword={isCurrentPasswordVisible}
                                                            />
                                                        )}
                                                        type={isCurrentPasswordVisible ? 'text' : 'password'}
                                                        value={values.currentPassword}
                                                    />
                                                );
                                            }}
                                        </Field>
                                        <WalletPasswordFieldLazy
                                            label='New Password'
                                            mt5Policy
                                            name='newPassword'
                                            onChange={handleChange}
                                            password={values.newPassword}
                                        />
                                    </div>
                                    <ul className='wallets-mt5-reset__requirements'>
                                        {passwordRequirements.map((requirement, index) => (
                                            <li key={index}>
                                                <WalletText size='sm'>{requirement}</WalletText>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className='wallets-mt5-reset__footer'>
                                <WalletButtonGroup isFlex isFullWidth={isMobile}>
                                    {/* TODO: Handle Forgot password flow */}
                                    <WalletButton size='lg' variant='outlined'>
                                        Forgot password?
                                    </WalletButton>
                                    <WalletButton
                                        disabled={!values.currentPassword || !validPasswordMT5(values.newPassword)}
                                        isLoading={isLoading}
                                        size='lg'
                                        type='submit'
                                    >
                                        Change my password
                                    </WalletButton>
                                </WalletButtonGroup>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </ModalStepWrapper>
    );
};

export default MT5ResetPasswordModal;
