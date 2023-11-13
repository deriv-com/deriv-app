import React from 'react';
import { Field, FieldProps, Formik } from 'formik';
import { WalletButton, WalletTextField } from '../../../../../../components/Base';
import { WithdrawalPercentageSelector } from '../WithdrawalPercentageSelector';
import { WithdrawalCryptoAmountConverter } from './components/WithdrawalCryptoAmountConverter';
import { useActiveWalletAccount, useCurrencyConfig } from '@deriv/api';
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
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: currencyConfig, getConfig } = useCurrencyConfig();
    const FRACTIONAL_DIGITS_CRYPTO = activeWallet?.currency ? getConfig(activeWallet?.currency)?.fractional_digits : 2;
    const FRACTIONAL_DIGITS_FIAT = getConfig('USD')?.fractional_digits;

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
            {({ errors, handleSubmit, isSubmitting, setValues, values }) => {
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
                        <WithdrawalPercentageSelector
                            amount={values.cryptoAmount}
                            balance={12}
                            message={`${
                                !Number.isNaN(parseFloat(values.cryptoAmount)) && activeWallet?.balance
                                    ? (parseFloat(values.cryptoAmount) * 100) / activeWallet?.balance
                                    : 0
                            }% of available balance (${activeWallet?.balance.toFixed(FRACTIONAL_DIGITS_CRYPTO)} ${
                                activeWallet?.currency
                            })`}
                            onPercentageChange={fraction => {
                                setValues({
                                    ...values,
                                    cryptoAmount:
                                        !!fraction && activeWallet?.balance
                                            ? (fraction * activeWallet?.balance).toFixed(FRACTIONAL_DIGITS_CRYPTO)
                                            : '',
                                });
                            }}
                        />
                        <WithdrawalCryptoAmountConverter activeWallet={activeWallet} />
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
