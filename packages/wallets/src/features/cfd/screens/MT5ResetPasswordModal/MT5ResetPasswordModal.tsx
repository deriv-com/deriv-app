import React, { ComponentProps, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useTradingPlatformPasswordChange } from '@deriv/api-v2';
import {
    ModalStepWrapper,
    WalletButton,
    WalletButtonGroup,
    WalletPasswordFieldLazy,
    WalletsActionScreen,
    WalletText,
    WalletTextField,
} from '../../../../components';
import PasswordViewerIcon from '../../../../components/Base/WalletPasswordField/PasswordViewerIcon';
import { useModal } from '../../../../components/ModalProvider';
import { passwordRequirements } from '../../../../constants/password';
import useDevice from '../../../../hooks/useDevice';
import MT5SuccessPasswordReset from '../../../../public/images/mt5-success-password-reset.svg';
import { validPasswordMT5 } from '../../../../utils/password-validation';
import { PlatformDetails } from '../../constants';
import './MT5ResetPasswordModal.scss';

type TFormInitialValues = {
    currentPassword: string;
    newPassword: string;
};

type TProps = {
    onClickSuccess: () => void;
    sendEmailVerification: () => void;
    setPassword: Dispatch<SetStateAction<string>>;
    successButtonLoading: boolean;
};

const SuccessButton = ({ isFullWidth, isLoading, onClick }: ComponentProps<typeof WalletButton>) => (
    <WalletButton isFullWidth={isFullWidth} isLoading={isLoading} onClick={onClick} size='lg'>
        Next
    </WalletButton>
);

const MT5ResetPasswordModal: React.FC<TProps> = ({
    onClickSuccess,
    sendEmailVerification,
    setPassword,
    successButtonLoading,
}) => {
    const { error, isLoading, isSuccess, mutateAsync: tradingPasswordChange } = useTradingPlatformPasswordChange();
    const initialValues: TFormInitialValues = { currentPassword: '', newPassword: '' };
    const { platform, title } = PlatformDetails.mt5;
    const { isDesktop, isMobile } = useDevice();
    const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
    const { show } = useModal();
    const formikRef = useRef<FormikProps<TFormInitialValues> | null>(null);

    const handleSuccessButtonClick = () => {
        if (formikRef.current?.values?.newPassword) {
            setPassword(formikRef.current?.values?.newPassword);
        }
        onClickSuccess();
    };

    const successButtonProps = {
        isFullWidth: isMobile,
        isLoading: successButtonLoading,
        onClick: handleSuccessButtonClick,
    };

    if (isSuccess) {
        show(
            <ModalStepWrapper
                renderFooter={() => (isMobile ? <SuccessButton {...successButtonProps} /> : null)}
                shouldFixedFooter={isMobile}
                shouldHideFooter={isDesktop}
                shouldHideHeader={isDesktop}
            >
                <div className='wallets-success-modal'>
                    <WalletsActionScreen
                        description={`You have a new ${title} password to log in to your ${title} accounts on the web and mobile apps.`}
                        descriptionSize='sm'
                        icon={<MT5SuccessPasswordReset />}
                        renderButtons={() => (isDesktop ? <SuccessButton {...successButtonProps} /> : null)}
                        title='Success'
                    />
                </div>
            </ModalStepWrapper>
        );
    }

    const validateCurrentPassword = (value: string) => {
        if (!value) return 'The field is required';
    };

    useEffect(() => {
        if (error) {
            formikRef.current?.setErrors({ currentPassword: error.error?.message });
        }
    }, [error]);

    const onFormSubmitHandler = async (values: TFormInitialValues) => {
        tradingPasswordChange({
            new_password: values.newPassword,
            old_password: values.currentPassword,
            platform,
        });
    };

    return (
        <ModalStepWrapper title={`${title} latest password requirements`}>
            <div className='wallets-mt5-reset'>
                <Formik initialValues={initialValues} innerRef={formikRef} onSubmit={onFormSubmitHandler}>
                    {({ errors, handleChange, values }) => (
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
                                                        errorMessage={form.errors[field.name]}
                                                        isInvalid={Boolean(form.errors[field.name])}
                                                        label='Current password'
                                                        name={field.name}
                                                        onBlur={field.onBlur}
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
                                        {passwordRequirements.map(requirement => (
                                            <li key={requirement}>
                                                <WalletText size='sm'>{requirement}</WalletText>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className='wallets-mt5-reset__footer'>
                                <WalletButtonGroup isFlex isFullWidth={isMobile}>
                                    <WalletButton onClick={sendEmailVerification} size='lg' variant='outlined'>
                                        Forgot password?
                                    </WalletButton>
                                    <WalletButton
                                        disabled={!!errors.currentPassword || !validPasswordMT5(values.newPassword)}
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
