import React, { useEffect, useState } from 'react';
import { Field, FieldProps, useFormikContext, FormikValues } from 'formik';
import './WithdrawalCryptoAmountConverter.scss';
import { WalletTextField } from '../../../../../../../../components';
import ArrowBold from '../../../../../../../../public/images/arrow-bold.svg';
import { useActiveWalletAccount, useExchangeRate } from '@deriv/api';
import classNames from 'classnames';

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
    const [isCryptoInputActive, SetIsCryptoInputActive] = useState(false);
    const { errors, getFieldProps, handleChange, setFieldValue, values } = useFormikContext<FormikValues>();

    useEffect(() => {
        if (activeWallet)
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

        if (parseFloat(value) > activeWallet?.balance) return helperMessageMapper.insufficientFunds;
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
                                    ? (value / exchangeRate?.rates[activeWallet?.currency]).toFixed(2)
                                    : '';
                            setFieldValue('fiatAmount', convertedValue);
                            return handleChange(e);
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
                                    ? (value * exchangeRate?.rates[activeWallet?.currency]).toFixed(8)
                                    : '';
                            setFieldValue('cryptoAmount', convertedValue);
                            return handleChange(e);
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
