import React, { useCallback, useEffect, useRef } from 'react';
import { useFormikContext } from 'formik';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button } from '@deriv-com/ui';
import { Timer, WalletTransferAmountInput } from '../../../../../../components';
import { useTransfer } from '../../provider';
import type { TInitialTransferFormValues } from '../../types';
import './TransferFormAmountInput.scss';

type TProps = {
    fieldName: 'fromAmount' | 'toAmount';
};

const DASH_VALUE = '--';
const MAX_DIGITS = 14;

const TransferFormAmountInput: React.FC<TProps> = ({ fieldName }) => {
    const { setFieldValue, setValues, values } = useFormikContext<TInitialTransferFormValues>();
    const { fromAccount, fromAmount, toAccount, toAmount } = values;
    const { localize } = useTranslations();

    const { activeWallet, activeWalletExchangeRates, hasPlatformStatus, refetchAccountLimits, refetchExchangeRates } =
        useTransfer();

    const refetchExchangeRatesAndLimits = useCallback(() => {
        refetchAccountLimits();
        const newRates = refetchExchangeRates();

        return newRates;
    }, [refetchAccountLimits, refetchExchangeRates]);

    const hasFunds = Number(fromAccount?.balance) > 0;
    const isFromAmountField = fieldName === 'fromAmount';
    const isSameCurrency = fromAccount?.currency === toAccount?.currency;
    const isAmountInputDisabled =
        !hasFunds || (fieldName === 'toAmount' && !toAccount) || [fromAccount, toAccount].some(hasPlatformStatus);
    const isAmountFieldActive = fieldName === values.activeAmountFieldName;
    const isTimerVisible =
        !isFromAmountField && toAccount && !isSameCurrency && Number(fromAmount) > 0 && Number(toAmount) > 0;
    const prevTimerVisible = useRef(isTimerVisible);
    const isMaxBtnVisible = isFromAmountField && activeWallet?.account_type === 'crypto';

    const amountValue = isFromAmountField ? fromAmount : toAmount;
    const toAmountLabel = isSameCurrency || !toAccount ? localize('Amount you receive') : localize('Estimated amount');
    const amountLabel = isFromAmountField ? localize('Amount you send') : toAmountLabel;

    const currency = isFromAmountField ? fromAccount?.currency : toAccount?.currency;
    const fractionDigits = isFromAmountField
        ? fromAccount?.currencyConfig?.fractional_digits
        : toAccount?.currencyConfig?.fractional_digits;

    const amountConverterHandler = useCallback(
        (value: number) => {
            if (
                !toAccount?.currency ||
                !fromAccount?.currency ||
                !activeWalletExchangeRates?.rates ||
                !isAmountFieldActive
            )
                return;

            const fromRate = activeWalletExchangeRates.rates[fromAccount.currency];
            const toRate = activeWalletExchangeRates.rates[toAccount.currency];

            if (isFromAmountField) {
                const convertedToAmount = (toRate ? value * toRate : value / fromRate).toFixed(
                    toAccount?.currencyConfig?.fractional_digits
                );
                setFieldValue('toAmount', convertedToAmount);
            } else {
                const convertedFromAmount = (toRate ? value / toRate : value * fromRate).toFixed(
                    fromAccount?.currencyConfig?.fractional_digits
                );
                setFieldValue('fromAmount', convertedFromAmount);
            }
        },
        [
            activeWalletExchangeRates?.rates,
            fromAccount?.currency,
            fromAccount?.currencyConfig?.fractional_digits,
            isAmountFieldActive,
            isFromAmountField,
            setFieldValue,
            toAccount?.currency,
            toAccount?.currencyConfig?.fractional_digits,
        ]
    );

    // If the source and target currencies are the same, set the target amount to the source amount
    useEffect(() => {
        if (isSameCurrency && toAccount?.currency) {
            setFieldValue('toAmount', fromAmount);
        }
    }, [isSameCurrency, toAccount?.currency, fromAmount, setFieldValue]);

    // Refetch exchange rates and limits when the target account (toAccount) changes or the timer becomes visible
    useEffect(() => {
        const shouldRefetchExchangeRatesAndLimits =
            (!isSameCurrency && !isFromAmountField && toAccount?.currency && !prevTimerVisible.current) ||
            isTimerVisible;

        if (shouldRefetchExchangeRatesAndLimits) {
            refetchExchangeRatesAndLimits();
        }

        prevTimerVisible.current = isTimerVisible;
    }, [isFromAmountField, isSameCurrency, isTimerVisible, refetchExchangeRatesAndLimits, toAccount?.currency]);

    useEffect(() => {
        if (!isSameCurrency && Number(amountValue) > 0) {
            amountConverterHandler(Number(amountValue));
        }
    }, [amountConverterHandler, amountValue, isSameCurrency]);

    const onBlurHandler = useCallback(() => {
        if (!isSameCurrency && Number(amountValue) > 0) {
            amountConverterHandler(Number(amountValue));
        }

        setFieldValue('activeAmountFieldName', undefined);
    }, [amountConverterHandler, amountValue, isSameCurrency, setFieldValue]);

    const onFocusHandler = useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            const { value } = e.currentTarget;
            const trimmedValue = value.trim();

            // If the value is a dash, set the other field value to empty
            if (trimmedValue === DASH_VALUE) {
                setFieldValue('toAmount', '');
                setFieldValue('fromAmount', '');
            }

            setFieldValue('activeAmountFieldName', fieldName);
            setFieldValue('lastFocusedField', fieldName);
        },
        [fieldName, setFieldValue]
    );

    const onChangeHandler = useCallback(
        (value: string) => {
            // Remove leading and trailing whitespace
            const trimmedValue = value.trim();

            // Check if the value is a valid number (only numbers with an optional decimal point are allowed)
            if (!/^\d*\.?\d*$/.test(trimmedValue)) return;

            // Check if the value has more decimal places than the allowed fraction digits
            const [, decimalPart] = trimmedValue.split('.');
            if (decimalPart && decimalPart.length > (fractionDigits ?? 0)) return;

            if (!isAmountFieldActive) return;

            // Reset the opposite field value when the input is empty or invalid
            if (Number.isNaN(Number(trimmedValue)) || Number(trimmedValue) === 0) {
                // Need to wrap in setTimeout to avoid race condition
                setTimeout(() => {
                    setFieldValue('fromAmount', isFromAmountField ? trimmedValue : '');
                    setFieldValue('toAmount', isFromAmountField ? '' : trimmedValue);
                });
                return;
            }

            if (isSameCurrency) {
                setValues(prev => ({ ...prev, fromAmount: trimmedValue, toAmount: trimmedValue }));
            } else {
                // If the value is empty, set the other field value to empty
                if (value === '') {
                    setValues(prev => ({ ...prev, fromAmount: '', toAmount: '' }));
                    return;
                }
                setFieldValue(fieldName, trimmedValue);
            }
        },
        [fieldName, fractionDigits, isAmountFieldActive, isFromAmountField, isSameCurrency, setFieldValue, setValues]
    );

    const onTimerCompleteHandler = useCallback(() => {
        refetchExchangeRatesAndLimits().then(res => {
            const newRates = res.data?.exchange_rates;
            if (!newRates?.rates || !fromAccount?.currency || !toAccount?.currency) return;

            const fromRate = newRates.rates[fromAccount.currency];
            const toRate = newRates.rates[toAccount.currency];

            const convertedFromAmount = (fromRate ? Number(toAmount) * fromRate : Number(toAmount) / toRate).toFixed(
                fromAccount?.currencyConfig?.fractional_digits
            );
            const convertedToAmount = (toRate ? Number(fromAmount) * toRate : Number(fromAmount) / fromRate).toFixed(
                toAccount?.currencyConfig?.fractional_digits
            );

            // if focused into the receiving account amount field, change the other ("from") field value
            if (values.activeAmountFieldName === 'toAmount') {
                setFieldValue('fromAmount', Number(convertedFromAmount) === 0 ? '' : convertedFromAmount);
            } else {
                setFieldValue('toAmount', Number(convertedToAmount) === 0 ? '' : convertedToAmount);
            }
        });
    }, [
        refetchExchangeRatesAndLimits,
        fromAccount?.currency,
        fromAccount?.currencyConfig?.fractional_digits,
        toAccount?.currency,
        toAccount?.currencyConfig?.fractional_digits,
        toAmount,
        fromAmount,
        values.activeAmountFieldName,
        setFieldValue,
    ]);

    const onMaxBtnClickHandler = useCallback(
        async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            const walletBalance = fromAccount?.balance;
            e.preventDefault();
            await setFieldValue('activeAmountFieldName', 'fromAmount');
            await setFieldValue('lastFocusedField', 'fromAmount');
            setFieldValue('fromAmount', walletBalance);
        },
        [fromAccount?.balance, setFieldValue]
    );

    return (
        <div className='wallets-transfer-form-amount-input'>
            <WalletTransferAmountInput
                currency={currency}
                disabled={isAmountInputDisabled}
                fractionDigits={fractionDigits}
                isError={values.isError}
                isLastFocusedField={values.lastFocusedField === fieldName}
                label={amountLabel}
                maxDigits={MAX_DIGITS}
                onBlur={onBlurHandler}
                onChange={onChangeHandler}
                onFocus={onFocusHandler}
                value={amountValue}
            />
            {isTimerVisible && (
                <div className='wallets-transfer-form-amount-input__timer'>
                    <Timer onComplete={onTimerCompleteHandler} />
                </div>
            )}
            {isMaxBtnVisible && (
                <Button
                    className='wallets-transfer-form-amount-input__max-btn'
                    color='black'
                    disabled={!hasFunds}
                    onClick={onMaxBtnClickHandler}
                    size='sm'
                    type='button'
                    variant='outlined'
                >
                    <Localize i18n_default_text='Max' />
                </Button>
            )}
        </div>
    );
};

export default TransferFormAmountInput;
