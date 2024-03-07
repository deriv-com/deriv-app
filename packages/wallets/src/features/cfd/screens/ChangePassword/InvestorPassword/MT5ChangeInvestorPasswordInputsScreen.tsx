import React, { useState } from 'react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useTradingPlatformInvestorPasswordChange } from '@deriv/api-v2';
import { WalletButton, WalletsActionScreen, WalletText } from '../../../../../components';
import { WalletPasswordFieldLazy, WalletTextField } from '../../../../../components/Base';
import PasswordViewerIcon from '../../../../../components/Base/WalletPasswordField/PasswordViewerIcon';
import { useModal } from '../../../../../components/ModalProvider';
import useDevice from '../../../../../hooks/useDevice';
import { validPassword } from '../../../../../utils/password';
import { PlatformDetails } from '../../../constants';

type TFormInitialValues = {
    currentPassword: string;
    newPassword: string;
};

type TProps = {
    sendEmail?: VoidFunction;
    setNextScreen?: VoidFunction;
};

const MT5ChangeInvestorPasswordInputsScreen: React.FC<TProps> = ({ sendEmail, setNextScreen }) => {
    const { isMobile } = useDevice();
    const { getModalState } = useModal();
    const mt5AccountId = getModalState('accountId') ?? '';
    const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
    const [hasCurrentPasswordFieldTouched, setHasCurrentPasswordFieldTouched] = useState(false);
    const { t } = useTranslation();

    const {
        error: changeInvestorPasswordError,
        mutateAsync: changeInvestorPassword,
        status: changeInvestorPasswordStatus,
    } = useTradingPlatformInvestorPasswordChange();

    const initialValues: TFormInitialValues = { currentPassword: '', newPassword: '' };

    const validateCurrentPassword = (value: string) => {
        if (!value) return 'The field is required';
        return undefined;
    };

    const onFormSubmitHandler = async (values: TFormInitialValues) => {
        await changeInvestorPassword({
            account_id: mt5AccountId,
            new_password: values.newPassword,
            old_password: values.currentPassword,
            platform: PlatformDetails.mt5.platform,
        });
        setNextScreen?.();
    };

    return (
        <WalletsActionScreen
            description={
                <>
                    <WalletText size='sm'>
                        Use this password to grant viewing access to another user. While they may view your trading
                        account, they will not be able to trade or take any other actions.
                    </WalletText>
                    <WalletText size='sm'>
                        If this is the first time you try to create a password, or you have forgotten your password,
                        please reset it.
                    </WalletText>
                    {changeInvestorPasswordError && (
                        <WalletText align='center' color='error' size='sm'>
                            {changeInvestorPasswordError?.error?.message}
                        </WalletText>
                    )}
                </>
            }
            descriptionSize='sm'
            renderButtons={() => (
                <Formik initialValues={initialValues} onSubmit={onFormSubmitHandler}>
                    {({ handleChange, values }) => (
                        <Form className='wallets-change-investor-password-screens__form'>
                            <div className='wallets-change-investor-password-screens__form-fields'>
                                <Field name='currentPassword' validate={validateCurrentPassword}>
                                    {({ field, form }: FieldProps) => {
                                        return (
                                            <WalletTextField
                                                autoComplete='current-password'
                                                errorMessage={hasCurrentPasswordFieldTouched && form.errors[field.name]}
                                                isInvalid={
                                                    hasCurrentPasswordFieldTouched && Boolean(form.errors[field.name])
                                                }
                                                label='Current investor password'
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
                                    autoComplete='new-password'
                                    label='New investor password'
                                    message={t(
                                        'Strong passwords contain at least 8 characters, combine uppercase and lowercase letters and numbers.'
                                    )}
                                    name='newPassword'
                                    onChange={handleChange}
                                    password={values.newPassword}
                                    showMessage
                                />
                            </div>
                            <div className='wallets-change-investor-password-screens__form-buttons'>
                                <WalletButton
                                    disabled={!values.currentPassword || !validPassword(values.newPassword)}
                                    isLoading={changeInvestorPasswordStatus === 'loading'}
                                    size={isMobile ? 'lg' : 'md'}
                                    type='submit'
                                >
                                    Change investor password
                                </WalletButton>
                                <WalletButton onClick={sendEmail} size={isMobile ? 'lg' : 'md'} variant='ghost'>
                                    Create or reset investor password
                                </WalletButton>
                            </div>
                        </Form>
                    )}
                </Formik>
            )}
        />
    );
};

export default MT5ChangeInvestorPasswordInputsScreen;
