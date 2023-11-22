import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';
import ArrowBold from '../../../../../../../../public/images/ic-back-arrow.svg';
import { WalletTextField } from '../../../../../../../../components';
import type { THooks } from '../../../../../../../../types';
import type { TForm } from '../../WithdrawalCryptoForm';
import './WithdrawalCryptoAmountConverter.scss';

type TProps = {
    activeWallet?: THooks.ActiveWalletAccount;
    exchangeRate?: THooks.ExchangeRate;
    getCurrencyConfig: THooks.GetCurrencyConfig;
};

const helperMessageMapper = {
    decimalPlacesExceeded: (limit: number) => `Up to ${limit} decimal places are allowed.`,
    insufficientFunds: 'Insufficient funds',
    invalidInput: 'Should be a valid number.',
    withdrawalLimitError: (min: string, max: string) => {
        return `The current allowed withdraw amount is ${min} to ${max}.`;
    },
};

const WithdrawalCryptoAmountConverter = ({ activeWallet, exchangeRate, getCurrencyConfig }: TProps) => {
    const [isCryptoInputActive, setIsCryptoInputActive] = useState(false);
    const { errors, setValues, values } = useFormikContext<TForm>();
    const FRACTIONAL_DIGITS_CRYPTO = activeWallet?.currency_config?.fractional_digits;
    const FRACTIONAL_DIGITS_FIAT = getCurrencyConfig('USD')?.fractional_digits;
    const MINIMUM_WITHDRAWAL_AMOUNT = activeWallet?.currency_config?.minimum_withdrawal;

    useEffect(() => {
        // update the amount when the exchangeRate is updated.
        const value = parseFloat(values.cryptoAmount);
        if (!Number.isNaN(value) && exchangeRate?.rates && activeWallet?.currency) {
            if (isCryptoInputActive)
                setValues({
                    ...values,
                    fiatAmount: (value / exchangeRate?.rates[activeWallet?.currency]).toFixed(FRACTIONAL_DIGITS_FIAT),
                });
            else
                setValues({
                    ...values,
                    cryptoAmount: (value * exchangeRate?.rates[activeWallet?.currency]).toFixed(
                        FRACTIONAL_DIGITS_CRYPTO
                    ),
                });
        }
    }, [activeWallet?.currency, exchangeRate?.rates]);

    const validateCryptoInput = (value: string) => {
        if (!value.length) return;

        const amount = parseFloat(parseFloat(value).toFixed(FRACTIONAL_DIGITS_CRYPTO));

        if (Number.isNaN(amount)) return helperMessageMapper.invalidInput;

        if (activeWallet?.balance && amount > activeWallet?.balance) return helperMessageMapper.insufficientFunds;

        if (
            MINIMUM_WITHDRAWAL_AMOUNT &&
            activeWallet?.balance &&
            activeWallet.currency &&
            amount < MINIMUM_WITHDRAWAL_AMOUNT
        ) {
            return helperMessageMapper.withdrawalLimitError(
                MINIMUM_WITHDRAWAL_AMOUNT.toFixed(FRACTIONAL_DIGITS_CRYPTO),
                activeWallet?.display_balance
            );
        }

        const fractionalPart = value.split('.');
        if (FRACTIONAL_DIGITS_CRYPTO && fractionalPart[1] && fractionalPart[1].length > FRACTIONAL_DIGITS_CRYPTO)
            return helperMessageMapper.decimalPlacesExceeded(FRACTIONAL_DIGITS_CRYPTO);
    };

    const validateFiatInput = (value: string) => {
        if (!value.length) return;

        if (Number.isNaN(parseFloat(value))) return helperMessageMapper.invalidInput;

        const fractionalPart = value.split('.');
        if (FRACTIONAL_DIGITS_FIAT && fractionalPart[1] && fractionalPart[1].length > FRACTIONAL_DIGITS_FIAT)
            return helperMessageMapper.decimalPlacesExceeded(FRACTIONAL_DIGITS_FIAT);
    };

    const onChangeCryptoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        const convertedValue =
            !Number.isNaN(value) && exchangeRate?.rates && activeWallet?.currency
                ? (value / exchangeRate?.rates[activeWallet?.currency]).toFixed(FRACTIONAL_DIGITS_FIAT)
                : '';
        setValues(values => ({
            ...values,
            cryptoAmount: e.target.value,
            fiatAmount: convertedValue,
        }));
    };

    const onChangeFiatInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        const convertedValue =
            !Number.isNaN(value) && exchangeRate?.rates && activeWallet?.currency
                ? (value * exchangeRate?.rates[activeWallet?.currency]).toFixed(FRACTIONAL_DIGITS_CRYPTO)
                : '';

        setValues(values => ({
            ...values,
            cryptoAmount: convertedValue,
            fiatAmount: e.target.value,
        }));
    };

    return (
        <div className='wallets-withdrawal-crypto-amount-converter'>
            <Field name='cryptoAmount' validate={validateCryptoInput}>
                {({ field }: FieldProps<string>) => (
                    <WalletTextField
                        {...field}
                        errorMessage={errors.cryptoAmount}
                        isInvalid={Boolean(errors.cryptoAmount)}
                        label={`Amount (${activeWallet?.currency})`}
                        onChange={onChangeCryptoInput}
                        onFocus={() => setIsCryptoInputActive(true)}
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
                        errorMessage={errors.fiatAmount}
                        isInvalid={Boolean(errors.fiatAmount)}
                        label='Amount (USD)'
                        message='Approximate value'
                        onChange={onChangeFiatInput}
                        onFocus={() => setIsCryptoInputActive(false)}
                        showMessage
                    />
                )}
            </Field>
        </div>
    );
};

export default WithdrawalCryptoAmountConverter;
