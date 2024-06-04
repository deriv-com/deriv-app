import React from 'react';
import { Field, FieldProps, Formik } from 'formik';
import { WalletButton, WalletTextField } from '../../../../../../components';
import { useWithdrawalCryptoContext } from '../../provider';
import { validateCryptoAddress } from '../../utils';
import { WithdrawalCryptoAmountConverter } from './components/WithdrawalCryptoAmountConverter';
import { WithdrawalCryptoPercentageSelector } from './components/WithdrawalCryptoPercentageSelector';
import './WithdrawalCryptoForm.scss';

const WithdrawalCryptoForm: React.FC = () => {
    const { activeWallet, fractionalDigits, requestCryptoWithdrawal } = useWithdrawalCryptoContext();

    return (
        <Formik
            initialValues={{
                cryptoAddress: '',
                cryptoAmount: '',
                fiatAmount: '',
            }}
            onSubmit={values =>
                requestCryptoWithdrawal({
                    address: values.cryptoAddress,
                    amount: parseFloat(parseFloat(values.cryptoAmount).toFixed(fractionalDigits.crypto)),
                })
            }
        >
            {({ errors, handleSubmit, isSubmitting, values }) => {
                return (
                    <form autoComplete='off' className='wallets-withdrawal-crypto-form' onSubmit={handleSubmit}>
                        <div className='wallets-withdrawal-crypto-address'>
                            <Field name='cryptoAddress' validate={validateCryptoAddress}>
                                {({ field }: FieldProps<string>) => (
                                    <WalletTextField
                                        {...field}
                                        data-testid='dt_withdrawal_crypto_address_input'
                                        errorMessage={errors.cryptoAddress}
                                        isInvalid={Boolean(errors?.cryptoAddress)}
                                        label={`Your ${activeWallet?.currency_config?.name} cryptocurrency wallet address`}
                                        showMessage
                                    />
                                )}
                            </Field>
                        </div>
                        <WithdrawalCryptoPercentageSelector />
                        <WithdrawalCryptoAmountConverter />
                        <div className='wallets-withdrawal-crypto-form__submit'>
                            <WalletButton
                                disabled={Object.keys(errors).length !== 0 || !values.cryptoAmount || isSubmitting}
                                isLoading={isSubmitting}
                                size='lg'
                                type='submit'
                            >
                                Withdraw
                            </WalletButton>
                        </div>
                    </form>
                );
            }}
        </Formik>
    );
};

export default WithdrawalCryptoForm;
