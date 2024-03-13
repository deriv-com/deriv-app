import React from 'react';
import { Form, Formik } from 'formik';
import { WalletButton, WalletPasswordFieldLazy, WalletText } from '../../../../components';
import { ModalProvider } from '../../../../components/ModalProvider';
import { passwordRequirements } from '../../../../constants/password';
import './MT5ResetPasswordModal.scss';

type TFormInitialValues = {
    currentPassword: string;
    newPassword: string;
};

// TODO: Implement onSubmit logic here.
// Is loosely based on <MT5ChangeInvestorPasswordInputsScreen />
const MT5ResetPasswordModal = () => {
    const initialValues: TFormInitialValues = { currentPassword: '', newPassword: '' };
    ``;
    return (
        <ModalProvider>
            <div className='wallets-mt5-reset'>
                <div className='wallets-mt5-reset__header'>
                    <WalletText lineHeight='xl' weight='bold'>
                        Deriv MT5 latest password requirements
                    </WalletText>
                </div>
                <Formik initialValues={initialValues}>
                    {({ handleChange, values }) => (
                        <Form>
                            <div className='wallets-mt5-reset__container'>
                                <div className='wallets-mt5-reset__content'>
                                    <WalletText size='sm'>
                                        To enhance your MT5 account security we have upgraded our password policy.
                                        <br />
                                        Please update your password accordingly.
                                    </WalletText>
                                    {/* TODO: Implement logic here. */}
                                    <div className='wallets-mt5-reset__fields'>
                                        <WalletPasswordFieldLazy
                                            label='Current Password'
                                            name='current_password'
                                            onChange={handleChange}
                                            password={values.currentPassword}
                                        />
                                        <WalletPasswordFieldLazy
                                            label='Current Password'
                                            name='new_password'
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
                                <WalletButton size='lg' variant='outlined'>
                                    Forgot password?
                                </WalletButton>
                                <WalletButton size='lg' type='submit'>
                                    Change my password
                                </WalletButton>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </ModalProvider>
    );
};

export default MT5ResetPasswordModal;
