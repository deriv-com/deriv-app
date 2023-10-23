import React from 'react';
import { Formik } from 'formik';
import { useActiveWalletAccount, useTransferBetweenAccounts } from '@deriv/api';
import { TransferFormDropdownModule, TransferFormInputFieldModule } from './components';
import './TransferForm.scss';

type TInitialValues = {
    amountReceive: number;
    amountSend: number;
    fromAccount?: NonNullable<ReturnType<typeof useActiveWalletAccount>['data']>;
    toAccount?: NonNullable<ReturnType<typeof useActiveWalletAccount>['data']>;
};

const TransferForm = () => {
    const { data: activeAccount } = useActiveWalletAccount();
    const { mutate } = useTransferBetweenAccounts();
    const initialValues: TInitialValues = {
        amountReceive: 0,
        amountSend: 0,
        fromAccount: activeAccount,
        toAccount: undefined,
    };

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
                                <TransferFormInputFieldModule
                                    defaultValue={props.values.amountSend}
                                    fieldName='amountSend'
                                    fractionDigits={props.values.fromAccount?.currency_config?.fractional_digits}
                                    label='Amount you send'
                                />
                                <TransferFormDropdownModule
                                    fieldName='fromAccount'
                                    initialAccount={props.initialValues.fromAccount}
                                    label='Transfer from'
                                />
                            </div>
                            <div style={{ height: '20px' }} />
                            <div className='wallets-transfer__form__fields-section'>
                                <TransferFormInputFieldModule
                                    defaultValue={props.values.amountReceive}
                                    fieldName='amountReceive'
                                    fractionDigits={props.values.toAccount?.currency_config?.fractional_digits}
                                    label='Estimated amount'
                                />
                                <TransferFormDropdownModule fieldName='toAccount' label='Transfer to' />
                            </div>
                        </div>
                        <button className='wallets-transfer__form__submit-button' type='submit'>
                            Transfer
                        </button>
                    </form>
                )}
            </Formik>
        </div>
    );
};

export default TransferForm;
