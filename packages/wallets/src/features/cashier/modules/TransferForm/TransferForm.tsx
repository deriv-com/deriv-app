import React, { useRef } from 'react';
import { Formik } from 'formik';
import { useTransferBetweenAccounts } from '@deriv/api';
import { Loader } from '../../../../components';
import { TransferFormDropdown } from './components/TransferFormDropdown';
import { TransferFormInputField } from './components/TransferFormInputField';
import { useWalletTransfer } from './hooks';
import type { TInitialTransferFormValues } from './types';
import './TransferForm.scss';

const TransferForm = () => {
    const { activeWallet, isLoading } = useWalletTransfer();
    const { mutate } = useTransferBetweenAccounts();
    const mobileAccountsListRef = useRef<HTMLDivElement | null>(null);

    const initialValues: TInitialTransferFormValues = {
        amountReceive: 0,
        amountSend: 0,
        fromAccount: activeWallet,
        toAccount: undefined,
    };

    if (isLoading) return <Loader />;

    return (
        <div className='wallets-transfer'>
            <Formik
                initialValues={initialValues}
                onSubmit={values => {
                    mutate({
                        account_from: values.fromAccount?.loginid,
                        account_to: values.toAccount?.loginid,
                        amount: Number(values.amountSend),
                        currency: values.fromAccount?.currency,
                    });
                }}
            >
                {props => (
                    <form className='wallets-transfer__form' onSubmit={props.handleSubmit}>
                        <div className='wallets-transfer__form__fields'>
                            <div className='wallets-transfer__form__fields-section'>
                                <TransferFormInputField
                                    defaultValue={props.values.amountSend}
                                    fieldName='amountSend'
                                    fractionDigits={props.values.fromAccount?.currencyConfig?.fractional_digits}
                                    label='Amount you send'
                                />
                                <TransferFormDropdown
                                    fieldName='fromAccount'
                                    label='Transfer from'
                                    mobileAccountsListRef={mobileAccountsListRef}
                                />
                            </div>
                            <div style={{ height: '20px' }} />
                            <div className='wallets-transfer__form__fields-section'>
                                <TransferFormInputField
                                    defaultValue={props.values.amountReceive}
                                    fieldName='amountReceive'
                                    fractionDigits={props.values.toAccount?.currencyConfig?.fractional_digits}
                                    label='Estimated amount'
                                />
                                <TransferFormDropdown
                                    fieldName='toAccount'
                                    label='Transfer to'
                                    mobileAccountsListRef={mobileAccountsListRef}
                                />
                            </div>
                        </div>
                        <button className='wallets-transfer__form__submit-button' type='submit'>
                            Transfer
                        </button>
                    </form>
                )}
            </Formik>
            {/* Portal for accounts list in mobile view */}
            <div className='wallets-transfer__mobile-accounts-list' ref={mobileAccountsListRef} />
        </div>
    );
};

export default TransferForm;
