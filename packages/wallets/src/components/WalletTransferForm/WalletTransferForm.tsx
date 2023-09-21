import React from 'react';
import { Formik } from 'formik';
import { useActiveWalletAccount, useTransferBetweenAccounts } from '@deriv/api';
import WalletTransferFormDropdown from '../WalletTransferFormDropdown/WalletTransferFormDropdown';
import WalletTransferFormInputField from '../WalletTransferFormInputField/WalletTransferFormInputField';
import './WalletTransferForm.scss';

const WalletTransferForm = () => {
    const { data: activeAccount } = useActiveWalletAccount();
    const { mutate } = useTransferBetweenAccounts();

    return (
        <Formik
            initialValues={{ amountReceive: 0, amountSend: 0, fromAccount: activeAccount?.loginid, toAccount: '' }}
            onSubmit={values => {
                mutate({
                    amount: Number(values.amountSend),
                    currency: activeAccount?.currency,
                    account_from: values.fromAccount,
                    account_to: values.toAccount,
                });
            }}
        >
            {props => (
                <form className='wallets-transform-form' onSubmit={props.handleSubmit}>
                    <div className='wallets-transform-form__fields'>
                        <div className='wallets-transform-form__fields-section'>
                            <WalletTransferFormInputField
                                defaultValue={props.values.amountSend}
                                fieldName='amountSend'
                                label='Amount you send'
                            />
                            <WalletTransferFormDropdown
                                fieldName='fromAccount'
                                initialAccount={props.initialValues.fromAccount}
                                label='Transfer from'
                            />
                        </div>
                        <div style={{ height: '20px' }} />
                        <div className='wallets-transform-form__fields-section'>
                            <WalletTransferFormInputField
                                defaultValue={props.values.amountReceive}
                                fieldName='amountReceive'
                                label='Estimated amount'
                            />
                            <WalletTransferFormDropdown fieldName='toAccount' label='Transfer to' />
                        </div>
                    </div>
                    <button className='wallets-transform-form__submit-button' type='submit'>
                        Transfer
                    </button>
                </form>
            )}
        </Formik>
    );
};

export default WalletTransferForm;
