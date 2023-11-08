import React, { useEffect, useState } from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import './WithdrawalCryptoAmountConverter.scss';
import { WalletTextField } from '../../../../../../../../components';
import ArrowBold from '../../../../../../../../public/images/arrow-bold.svg';
import { useActiveWalletAccount, useExchangeRate } from '@deriv/api';
import classNames from 'classnames';

const helperMessageMapper = {
    invalidInput: 'Should be a valid number.',
    insufficientFunds: 'Insufficient funds',
    withdrawalLimit: (min: number, max: number, currency: string) =>
        `The current allowed withdraw amount is ${min} to ${max} BTC ${currency}.`,
};

const WithdrawalCryptoAmountConverter = () => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: exchangeRate, subscribe, unsubscribe } = useExchangeRate();
    const [isCryptoInputActive, SetIsCryptoInputActive] = useState(false);

    useEffect(() => {
        if (activeWallet?.currency)
            subscribe({
                base_currency: 'USD',
                target_currency: activeWallet.currency,
            });
        return () => unsubscribe();
    }, []);

    const validateInput = (value: string) => {
        if (!value.length) return undefined;
        if (Number.isNaN(parseFloat(value))) return helperMessageMapper.invalidInput;

        const cryptoNumber = parseFloat(value);
        if (cryptoNumber > activeWallet?.balance) return helperMessageMapper.insufficientFunds;
    };

    const { errors, handleChange, values } = useFormikContext();

    useEffect(() => {
        // console.log(errors);
    }, [errors]);

    return (
        <div className='wallets-withdrawal-crypto-amount-converter'>
            <Field name='cryptoAmount' validate={validateInput}>
                {({ field }: FieldProps<string>) => (
                    <WalletTextField
                        helperMessage={errors.cryptoAmount}
                        label={`Amount (${activeWallet?.currency})`}
                        onFocus={() => SetIsCryptoInputActive(true)}
                        {...field}
                        value={
                            !isCryptoInputActive && errors.fiatAmount === undefined
                                ? values.fiatAmount
                                    ? (values.fiatAmount * exchangeRate?.rates[activeWallet?.currency]).toFixed(8)
                                    : ''
                                : values.cryptoAmount.toString()
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
            <Field name='fiatAmount' validate={validateInput}>
                {({ field }: FieldProps<string>) => (
                    <WalletTextField
                        label='Amount (USD)'
                        onFocus={() => SetIsCryptoInputActive(false)}
                        {...field}
                        helperMessage={errors.fiatAmount}
                        value={
                            isCryptoInputActive && errors.cryptoAmount === undefined
                                ? values.cryptoAmount && errors.cryptoAmount
                                    ? (values.cryptoAmount / exchangeRate?.rates[activeWallet?.currency]).toFixed(2)
                                    : ''
                                : values.fiatAmount.toString()
                        }
                    />
                )}
            </Field>
        </div>
    );
};

export default WithdrawalCryptoAmountConverter;
