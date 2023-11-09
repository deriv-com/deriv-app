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
    const { errors, getFieldProps, handleChange, values } = useFormikContext<FormikValues>();

    useEffect(() => {
        if (activeWallet?.currency)
            subscribe({
                base_currency: 'USD',
                target_currency: activeWallet.currency,
            });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // console.log(errors, values, values.fiatAmount && !errors.fiatAmount);
    }, [errors, values]);

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
                        onFocus={() => SetIsCryptoInputActive(true)}
                        showMessage
                        value={
                            !isCryptoInputActive
                                ? values.fiatAmount && !errors.fiatAmount
                                    ? (values.fiatAmount * exchangeRate?.rates[activeWallet?.currency]).toFixed(8)
                                    : ''
                                : values.cryptoAmount
                        }
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
                        onFocus={() => SetIsCryptoInputActive(false)}
                        showMessage
                        value={
                            isCryptoInputActive
                                ? values.cryptoAmount && errors.cryptoAmount === undefined
                                    ? (values.cryptoAmount / exchangeRate?.rates[activeWallet?.currency]).toFixed(2)
                                    : ''
                                : values.fiatAmount
                        }
                    />
                )}
            </Field>
        </div>
    );
};

export default WithdrawalCryptoAmountConverter;
