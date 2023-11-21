import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useActiveWalletAccount, useCurrencyConfig, useExchangeRate } from '@deriv/api';
import ArrowBold from '../../../../../../../../public/images/arrow-bold.svg';
import { WalletTextField } from '../../../../../../../../components';
import type { TForm } from '../../WithdrawalCryptoForm';
import './WithdrawalCryptoAmountConverter.scss';

type TProps = {
    activeWallet: ReturnType<typeof useActiveWalletAccount>['data'];
    exchangeRate: ReturnType<typeof useExchangeRate>['data'];
    getCurrencyConfig: ReturnType<typeof useCurrencyConfig>['getConfig'];
};

const helperMessageMapper = {
    decimalPlacesExceeded: (limit: number) => `Up to ${limit} decimal places are allowed.`,
    insufficientFunds: 'Insufficient funds',
    invalidInput: 'Should be a valid number.',
    withdrawalLimitError: (min: string, max: string, currency: string) => {
        return `The current allowed withdraw amount is ${min} to ${max} ${currency}.`;
    },
};

const WithdrawalCryptoAmountConverter = ({ activeWallet, exchangeRate, getCurrencyConfig }: TProps) => {
    const [isCryptoInputActive, setIsCryptoInputActive] = useState(false);
    const { errors, setValues, values } = useFormikContext<TForm>();
    const FRACTIONAL_DIGITS_CRYPTO = activeWallet?.currency
        ? getCurrencyConfig(activeWallet?.currency)?.fractional_digits
        : 8;
    const FRACTIONAL_DIGITS_FIAT = getCurrencyConfig('USD')?.fractional_digits;
    const MINIMUM_WITHDRAWAL_AMOUNT = activeWallet?.currency
        ? getCurrencyConfig(activeWallet?.currency)?.minimum_withdrawal
        : 0;

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
    }, [exchangeRate?.rates]);

    const validateCryptoInput = (value: string) => {
        if (!value.length) return undefined;

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
                activeWallet?.balance.toFixed(FRACTIONAL_DIGITS_CRYPTO),
                activeWallet?.currency
            );
        }

        const fractionalPart = value.split('.');
        if (FRACTIONAL_DIGITS_CRYPTO && fractionalPart[1] && fractionalPart[1].length > FRACTIONAL_DIGITS_CRYPTO)
            return helperMessageMapper.decimalPlacesExceeded(FRACTIONAL_DIGITS_CRYPTO);

        return undefined;
    };

    const validateFiatInput = (value: string) => {
        if (!value.length) return undefined;

        if (Number.isNaN(parseFloat(value))) return helperMessageMapper.invalidInput;

        const fractionalPart = value.split('.');
        if (FRACTIONAL_DIGITS_FIAT && fractionalPart[1] && fractionalPart[1].length > FRACTIONAL_DIGITS_FIAT)
            return helperMessageMapper.decimalPlacesExceeded(FRACTIONAL_DIGITS_FIAT);

        return undefined;
    };

    const onChangeCryptoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        const convertedValue =
            !Number.isNaN(value) && exchangeRate?.rates && activeWallet?.currency
                ? (value / exchangeRate?.rates[activeWallet?.currency]).toFixed(FRACTIONAL_DIGITS_FIAT)
                : '';
        setValues({
            ...values,
            cryptoAmount: e.target.value,
            fiatAmount: convertedValue,
        });
    };

    const onChangeFiatInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        const convertedValue =
            !Number.isNaN(value) && exchangeRate?.rates && activeWallet?.currency
                ? (value * exchangeRate?.rates[activeWallet?.currency]).toFixed(FRACTIONAL_DIGITS_CRYPTO)
                : '';

        setValues({
            ...values,
            cryptoAmount: convertedValue,
            fiatAmount: e.target.value,
        });
    };

    return (
        <div className='wallets-withdrawal-crypto-amount-converter'>
            <Field name='cryptoAmount' validate={validateCryptoInput}>
                {({ field }: FieldProps<string>) => (
                    <WalletTextField
                        {...field}
                        errorMessage={errors.cryptoAmount}
                        isInvalid={Object.keys(errors).includes('cryptoAmount') && errors.cryptoAmount !== ''}
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
                        isInvalid={Object.keys(errors).includes('fiatAmount') && errors.fiatAmount !== ''}
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
