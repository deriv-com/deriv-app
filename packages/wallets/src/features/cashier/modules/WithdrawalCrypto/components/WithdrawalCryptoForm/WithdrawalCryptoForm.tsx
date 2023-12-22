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

    const getPercentageMessage = (value: string) => {
        const amount = parseFloat(value);
        if (!activeWallet?.balance) return;

        if (amount <= activeWallet?.balance) {
            const percentage = Math.round((amount * 100) / activeWallet?.balance);
            return `${percentage}% of available balance ${activeWallet?.display_balance}`;
        }
    };

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
                                    activeWallet?.balance &&
                                    exchangeRates?.data?.rates &&
                                    !Number.isNaN(parseFloat(values.cryptoAmount)) &&
                                    parseFloat(values.cryptoAmount) <= activeWallet.balance
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
                            <div className='wallets-withdrawal-crypto-form__percentage-message'>
                                <WalletText color='less-prominent' size='xs'>
                                    {getPercentageMessage(values.cryptoAmount)}
                                </WalletText>
                            </div>
                        </div>
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
