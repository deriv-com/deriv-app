import React from 'react';
import { Field, FieldProps, Formik } from 'formik';
import { WalletButton, WalletTextField } from '../../../../../../components/Base';
import { WithdrawalPercentageSelector } from '../WithdrawalPercentageSelector';
import { WithdrawalCryptoAmountConverter } from './components/WithdrawalCryptoAmountConverter';
import './WithdrawalCryptoForm.scss';

const MIN_ADDRESS_LENGTH = 25;
const MAX_ADDRESS_LENGTH = 64;

export type TForm = {
    cryptoAddress: string;
    cryptoAmount: string;
    fiatAmount: string;
    withdrawAmount?: number;
};

const validateCryptoAddress = (address: string) => {
    if (!address) return 'This field is required.';

    if (address.length < MIN_ADDRESS_LENGTH || address.length > MAX_ADDRESS_LENGTH) {
        return 'Your wallet address should have 25 to 64 characters.';
    }

    return undefined;
};

const WithdrawalCryptoForm = () => {
    return (
        <Formik
            initialValues={{
                cryptoAddress: '',
                cryptoAmount: '',
                fiatAmount: '',
                withdrawAmount: undefined,
            }}
            onSubmit={values => ''}
        >
            {({ errors, handleSubmit, isSubmitting }) => {
                return (
                    <form autoComplete='off' className='wallets-withdrawal-crypto-form' onSubmit={handleSubmit}>
                        <div className='wallets-withdrawal-crypto-address'>
                            <Field name='cryptoAddress' validate={validateCryptoAddress}>
                                {({ field }: FieldProps<string>) => (
                                    <WalletTextField
                                        {...field}
                                        helperMessage={errors.cryptoAddress}
                                        label='Your BTC Wallet address'
                                        showMessage
                                    />
                                )}
                            </Field>
                        </div>
                        <WithdrawalPercentageSelector balance={12} message='blah! blah1 yada!' />
                        <WithdrawalCryptoAmountConverter />
                        <div className='wallets-withdrawal-crypto__submit'>
                            <WalletButton disabled={!!errors || isSubmitting} size='lg' text='Withdraw' type='submit' />
                        </div>
                    </form>
                );
            }}
        </Formik>
    );
};

export default WithdrawalCryptoForm;
