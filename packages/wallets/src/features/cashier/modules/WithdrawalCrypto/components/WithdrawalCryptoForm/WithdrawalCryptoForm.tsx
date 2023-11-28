import React, { useEffect } from 'react';
import { Field, FieldProps, Formik } from 'formik';
import { useExchangeRate } from '@deriv/api';
import { WalletButton, WalletsPercentageSelector, WalletText, WalletTextField } from '../../../../../../components';
import type { THooks } from '../../../../../../types';
import { WithdrawalCryptoAmountConverter } from './components/WithdrawalCryptoAmountConverter';
import './WithdrawalCryptoForm.scss';

const MIN_ADDRESS_LENGTH = 25;
const MAX_ADDRESS_LENGTH = 64;

export type TForm = {
    cryptoAddress: string;
    cryptoAmount: string;
    fiatAmount: string;
};

type TWithdrawalCryptoFormProps = {
    activeWallet?: THooks.ActiveWalletAccount;
    getCurrencyConfig: THooks.GetCurrencyConfig;
    requestCryptoWithdrawal: (values: Parameters<THooks.CryptoWithdrawal>[0]) => void;
    verificationCode?: string;
};

const validateCryptoAddress = (address: string) => {
    if (!address) return 'This field is required.';

    if (address.length < MIN_ADDRESS_LENGTH || address.length > MAX_ADDRESS_LENGTH) {
        return 'Your wallet address should have 25 to 64 characters.';
    }

    return undefined;
};

const WithdrawalCryptoForm: React.FC<TWithdrawalCryptoFormProps> = ({
    activeWallet,
    getCurrencyConfig,
    requestCryptoWithdrawal,
    verificationCode,
}) => {
    const { data: exchangeRate, subscribe, unsubscribe } = useExchangeRate();

    const FRACTIONAL_DIGITS_CRYPTO = activeWallet?.currency_config?.fractional_digits;
    const FRACTIONAL_DIGITS_FIAT = getCurrencyConfig('USD')?.fractional_digits;

    useEffect(() => {
        if (activeWallet?.currency)
            subscribe({
                base_currency: 'USD',
                loginid: activeWallet.loginid,
                target_currency: activeWallet.currency,
            });
        return () => unsubscribe();
    }, [activeWallet?.currency, activeWallet?.loginid, subscribe, unsubscribe]);

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
                    amount: parseFloat(parseFloat(values.cryptoAmount).toFixed(FRACTIONAL_DIGITS_CRYPTO)),
                    verification_code: verificationCode,
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
                                    !Number.isNaN(parseFloat(values.cryptoAmount)) && exchangeRate?.rates
                                        ? parseFloat(values.cryptoAmount)
                                        : 0
                                }
                                balance={activeWallet?.balance || 0}
                                onChangePercentage={percentage => {
                                    const fraction = percentage / 100;

                                    const cryptoAmount =
                                        !!fraction && activeWallet?.balance
                                            ? (fraction * activeWallet?.balance).toFixed(FRACTIONAL_DIGITS_CRYPTO)
                                            : '';

                                    const fiatAmount =
                                        !!fraction &&
                                        activeWallet?.balance &&
                                        activeWallet?.currency &&
                                        exchangeRate?.rates
                                            ? (
                                                  (fraction * activeWallet?.balance) /
                                                  exchangeRate?.rates[activeWallet.currency]
                                              ).toFixed(FRACTIONAL_DIGITS_FIAT)
                                            : '';

                                    return setValues({
                                        ...values,
                                        cryptoAmount,
                                        fiatAmount,
                                    });
                                }}
                            />
                            <WalletText color='less-prominent' size='xs'>
                                {!Number.isNaN(parseFloat(values.cryptoAmount)) && activeWallet?.balance
                                    ? Math.round((parseFloat(values.cryptoAmount) * 100) / activeWallet?.balance)
                                    : '0'}
                                % of available balance ({activeWallet?.display_balance})
                            </WalletText>
                        </div>
                        <WithdrawalCryptoAmountConverter
                            activeWallet={activeWallet}
                            exchangeRate={exchangeRate}
                            getCurrencyConfig={getCurrencyConfig}
                        />
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
