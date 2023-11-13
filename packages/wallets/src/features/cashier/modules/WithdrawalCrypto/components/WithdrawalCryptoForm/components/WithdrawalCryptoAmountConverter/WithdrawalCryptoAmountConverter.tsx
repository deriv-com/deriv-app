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
    const [isCryptoInputActive, SetIsCryptoInputActive] = useState(false);
    const { errors, setValues, values } = useFormikContext<TForm>();
    const FRACTIONAL_DIGITS_CRYPTO = activeWallet?.currency
        ? getCurrencyConfig(activeWallet?.currency)?.fractional_digits
        : 2;
    const FRACTIONAL_DIGITS_FIAT = getCurrencyConfig('USD')?.fractional_digits;

    const validateCryptoInput = (value: string) => {
        if (!value.length) return undefined;

        const amount = parseFloat(value);
        const minimumWithdrawal = activeWallet?.currency
            ? getCurrencyConfig(activeWallet?.currency)?.minimum_withdrawal
            : 0;

        if (Number.isNaN(amount)) return helperMessageMapper.invalidInput;

        if (activeWallet?.balance && amount > activeWallet?.balance) return helperMessageMapper.insufficientFunds;

        if (minimumWithdrawal && activeWallet?.balance && activeWallet.currency && amount < minimumWithdrawal)
            return helperMessageMapper.withdrawalLimitError(
                minimumWithdrawal.toFixed(FRACTIONAL_DIGITS_CRYPTO),
                activeWallet?.balance.toFixed(FRACTIONAL_DIGITS_CRYPTO),
                activeWallet?.currency
            );

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
                                !Number.isNaN(value) &&
                                exchangeRate?.rates &&
                                activeWallet?.currency &&
                                !errors.cryptoAmount
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
                                !Number.isNaN(value) &&
                                exchangeRate?.rates &&
                                activeWallet?.currency &&
                                !errors.fiatAmount
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
