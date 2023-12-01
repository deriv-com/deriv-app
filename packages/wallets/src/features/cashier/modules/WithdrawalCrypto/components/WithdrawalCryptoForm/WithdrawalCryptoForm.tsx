import React from 'react';
import { Field, FieldProps, Formik } from 'formik';
import { WalletButton, WalletsPercentageSelector, WalletText, WalletTextField } from '../../../../../../components';
import { useWithdrawalCryptoValidator } from '../../hooks';
import { useWithdrawalCryptoContext } from '../../provider/WithdrawalCryptoProvider';
import { WithdrawalCryptoAmountConverter } from './components/WithdrawalCryptoAmountConverter';
import './WithdrawalCryptoForm.scss';

const WithdrawalCryptoForm: React.FC = () => {
    const { activeWallet, exchangeRates, fractionalDigits, getConvertedFiatAmount, requestCryptoWithdrawal } =
        useWithdrawalCryptoContext();
    const { validateCryptoAddress } = useWithdrawalCryptoValidator(activeWallet, fractionalDigits);

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
            {({ errors, handleSubmit, isSubmitting, setValues, values }) => {
                return (
                    <form autoComplete='off' className='wallets-withdrawal-crypto-form' onSubmit={handleSubmit}>
                        <div className='wallets-withdrawal-crypto-address'>
                            <Field name='cryptoAddress' validate={validateCryptoAddress}>
                                {({ field }: FieldProps<string>) => (
                                    <WalletTextField
                                        {...field}
                                        errorMessage={errors.cryptoAddress}
                                        isInvalid={Boolean(errors?.cryptoAddress)}
                                        label={`Your ${activeWallet?.currency_config?.name} cryptocurrency wallet address`}
                                        showMessage
                                    />
                                )}
                            </Field>
                        </div>
                        <div className='wallets-withdrawal-crypto-form__percentage'>
                            <WalletsPercentageSelector
                                amount={
                                    !Number.isNaN(parseFloat(values.cryptoAmount)) && exchangeRates?.data?.rates
                                        ? parseFloat(values.cryptoAmount)
                                        : 0
                                }
                                balance={activeWallet?.balance ?? 0}
                                onChangePercentage={percentage => {
                                    if (activeWallet?.balance) {
                                        const fraction = percentage / 100;
                                        const cryptoAmount = (activeWallet?.balance * fraction).toFixed(
                                            fractionalDigits.crypto
                                        );
                                        const fiatAmount = getConvertedFiatAmount(cryptoAmount);

                                        return setValues({
                                            ...values,
                                            cryptoAmount,
                                            fiatAmount,
                                        });
                                    }
                                }}
                            />
                            <WalletText color='less-prominent' size='xs'>
                                {!Number.isNaN(parseFloat(values.cryptoAmount)) && activeWallet?.balance
                                    ? Math.round((parseFloat(values.cryptoAmount) * 100) / activeWallet?.balance)
                                    : '0'}
                                % of available balance ({activeWallet?.display_balance})
                            </WalletText>
                        </div>
                        <WithdrawalCryptoAmountConverter />
                        <div className='wallets-withdrawal-crypto-form__submit'>
                            <WalletButton
                                disabled={Object.keys(errors).length !== 0 || !values.cryptoAmount || isSubmitting}
                                isLoading={isSubmitting}
                                size='lg'
                                text='Withdraw'
                                type='submit'
                            />
                        </div>
                    </form>
                );
            }}
        </Formik>
    );
};

export default WithdrawalCryptoForm;
