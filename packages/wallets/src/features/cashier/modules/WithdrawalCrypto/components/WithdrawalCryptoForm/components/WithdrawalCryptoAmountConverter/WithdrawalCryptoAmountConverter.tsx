import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useActiveWalletAccount, useCurrencyConfig, useExchangeRate } from '@deriv/api';
import ArrowBold from '../../../../../../../../public/images/arrow-bold.svg';
import { WalletTextField } from '../../../../../../../../components';
import type { TForm } from '../../WithdrawalCryptoForm';
import './WithdrawalCryptoAmountConverter.scss';

const helperMessageMapper = {
    invalidInput: 'Should be a valid number.',
    insufficientFunds: 'Insufficient funds',
    withdrawalLimit: (min: number, max: number, currency: string) => {
        return `The current allowed withdraw amount is ${min} to ${max} BTC ${currency}.`;
    },
};

const WithdrawalCryptoAmountConverter = () => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: exchangeRate, subscribe, unsubscribe } = useExchangeRate();
    const { getConfig } = useCurrencyConfig();
    const [isCryptoInputActive, SetIsCryptoInputActive] = useState(false);
    const { errors, setValues, values } = useFormikContext<TForm>();
    const FRACTIONAL_DIGITS_CRYPTO = getConfig(activeWallet?.currency)?.fractional_digits;
    const FRACTIONAL_DIGITS_FIAT = getConfig('USD')?.fractional_digits;

    useEffect(() => {
        if (activeWallet?.currency)
            subscribe({
                base_currency: 'USD',
                target_currency: activeWallet.currency,
                loginid: activeWallet.loginid,
            });
        return () => unsubscribe();
    }, []);

    const validateCryptoInput = (value: string, balance: number) => {
        if (!value.length) return undefined;

        if (Number.isNaN(parseFloat(value))) return helperMessageMapper.invalidInput;

        if (activeWallet?.balance && parseFloat(value) > activeWallet?.balance)
            return helperMessageMapper.insufficientFunds;

        return undefined;
    };

    const validateFiatInput = (value: string) => {
        if (!value.length) return undefined;

        if (Number.isNaN(parseFloat(value))) return helperMessageMapper.invalidInput;

        return undefined;
    };

    return (
        <div className='wallets-withdrawal-crypto-amount-converter'>
            <Field name='cryptoAmount' validate={validateCryptoInput}>
                {({ field }: FieldProps<string>) => (
                    <WalletTextField
                        {...field}
                        helperMessage={errors.cryptoAmount}
                        label={`Amount (${activeWallet?.currency})`}
                        onChange={e => {
                            const value = parseFloat(e.target.value);
                            const convertedValue =
                                !Number.isNaN(value) && exchangeRate?.rates && activeWallet?.currency
                                    ? (value / exchangeRate?.rates[activeWallet?.currency]).toFixed(
                                          FRACTIONAL_DIGITS_FIAT
                                      )
                                    : '';
                            setValues({
                                ...values,
                                cryptoAmount: e.target.value,
                                fiatAmount: convertedValue,
                            });
                        }}
                        onFocus={() => SetIsCryptoInputActive(true)}
                        showMessage
                    />
                )}
            </Field>
            <div
                className={classNames('wallets-withdrawal-crypto-amount-converter__arrow', {
                    'wallets-withdrawal-crypto-amount-converter__arrow--rtl': !isCryptoInputActive,
                })}
            >
                <ArrowBold />
            </div>
            <Field name='fiatAmount' validate={validateFiatInput}>
                {({ field }: FieldProps<string>) => (
                    <WalletTextField
                        {...field}
                        helperMessage={errors.fiatAmount ?? 'Approximate value'}
                        label='Amount (USD)'
                        onChange={e => {
                            const value = parseFloat(e.target.value);
                            const convertedValue =
                                !Number.isNaN(value) && exchangeRate?.rates && activeWallet?.currency
                                    ? (value * exchangeRate?.rates[activeWallet?.currency]).toFixed(
                                          FRACTIONAL_DIGITS_CRYPTO
                                      )
                                    : '';

                            setValues({
                                ...values,
                                cryptoAmount: convertedValue,
                                fiatAmount: e.target.value,
                            });
                        }}
                        onFocus={() => SetIsCryptoInputActive(false)}
                        showMessage
                    />
                )}
            </Field>
        </div>
    );
};

export default WithdrawalCryptoAmountConverter;
