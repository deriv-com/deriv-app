import React, { useCallback, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { useDebounce } from 'usehooks-ts';
import { useExchangeRate } from '@deriv/api';
import { ATMAmountInput, Timer } from '../../../../../../components';
import { useTransfer } from '../../provider';
import type { TInitialTransferFormValues } from '../../types';
import './TransferFormAmountInput.scss';

type TProps = {
    fieldName: 'fromAmount' | 'toAmount';
};

const MAX_DIGITS = 14;

const TransferFormAmountInput: React.FC<TProps> = ({ fieldName }) => {
    const { data: exchangeRate, subscribe, unsubscribe } = useExchangeRate();
    const { activeWallet } = useTransfer();
    const { setFieldValue, setValues, values } = useFormikContext<TInitialTransferFormValues>();
    const { fromAccount, fromAmount, toAccount, toAmount } = values;

    const isFromAmountFieldName = fieldName === 'fromAmount';
    const isSameCurrency = fromAccount?.currency === toAccount?.currency;
    const amountValue = isFromAmountFieldName ? fromAmount : toAmount;
    const debouncedAmountValue = useDebounce(values.activeAmountFieldName === fieldName ? amountValue : undefined, 500);
    const toAmountLabel = isSameCurrency || !toAccount ? 'Amount you receive' : 'Estimated amount';
    const amountLabel = isFromAmountFieldName ? 'Amount you send' : toAmountLabel;
    const currency = isFromAmountFieldName ? fromAccount?.currency : toAccount?.currency;
    const fractionDigits = isFromAmountFieldName
        ? fromAccount?.currencyConfig?.fractional_digits
        : toAccount?.currencyConfig?.fractional_digits;
    const isAmountInputDisabled = fieldName === 'toAmount' && !toAccount;
    const isAmountFieldActive = fieldName === values.activeAmountFieldName;
    const isTimerVisible = !isFromAmountFieldName && toAccount && !isSameCurrency && fromAmount > 0 && toAmount > 0;

    useEffect(() => {
        if (!fromAccount?.currency || !toAccount?.currency || !activeWallet?.loginid) return;
        subscribe({
            base_currency: fromAccount?.currency,
            loginid: activeWallet?.loginid,
            target_currency: toAccount?.currency,
        });
        return () => unsubscribe();
    }, [
        activeWallet?.currency,
        activeWallet?.loginid,
        fromAccount?.currency,
        subscribe,
        toAccount?.currency,
        unsubscribe,
    ]);

    const amountConverterHandler = useCallback(
        (value: number) => {
            if (!toAccount?.currency || !exchangeRate?.rates || !isAmountFieldActive) return;

            const toRate = exchangeRate.rates[toAccount.currency];

            if (isFromAmountFieldName) {
                const convertedToAmount = Number(
                    (value * toRate).toFixed(toAccount?.currencyConfig?.fractional_digits)
                );
                setFieldValue('toAmount', convertedToAmount);
            } else {
                const convertedFromAmount = Number(
                    (value / toRate).toFixed(fromAccount?.currencyConfig?.fractional_digits)
                );
                setFieldValue('fromAmount', convertedFromAmount);
            }
        },
        [
            exchangeRate?.rates,
            fromAccount?.currencyConfig?.fractional_digits,
            isAmountFieldActive,
            isFromAmountFieldName,
            setFieldValue,
            toAccount?.currency,
            toAccount?.currencyConfig?.fractional_digits,
        ]
    );

    useEffect(() => {
        if (debouncedAmountValue && !isSameCurrency) {
            amountConverterHandler(debouncedAmountValue);
        }
    }, [amountConverterHandler, debouncedAmountValue, isSameCurrency]);

    const onChangeHandler = useCallback(
        (value: number) => {
            if (!isAmountFieldActive) return;

            if (isSameCurrency) {
                setValues(prev => ({ ...prev, fromAmount: value, toAmount: value }));
            } else {
                if (value === 0) {
                    setValues(prev => ({ ...prev, fromAmount: 0, toAmount: 0 }));
                    return;
                }
                setFieldValue(fieldName, value);
            }
        },
        [fieldName, isAmountFieldActive, isSameCurrency, setFieldValue, setValues]
    );

    const onTimerCompleteHandler = useCallback(() => {
        if (!toAccount?.currency || !exchangeRate?.rates) return;

        const toRate = exchangeRate.rates[toAccount.currency];
        const convertedToAmount = Number((fromAmount * toRate).toFixed(toAccount?.currencyConfig?.fractional_digits));
        setFieldValue('toAmount', convertedToAmount);
    }, [
        exchangeRate?.rates,
        fromAmount,
        setFieldValue,
        toAccount?.currency,
        toAccount?.currencyConfig?.fractional_digits,
    ]);

    return (
        <div className='wallets-transfer-form-amount-input'>
            <ATMAmountInput
                currency={currency}
                disabled={isAmountInputDisabled}
                fractionDigits={fractionDigits}
                label={amountLabel}
                maxDigits={MAX_DIGITS}
                onBlur={() => setFieldValue('activeAmountFieldName', undefined)}
                onChange={onChangeHandler}
                onFocus={() => setFieldValue('activeAmountFieldName', fieldName)}
                value={amountValue}
            />
            {isTimerVisible && (
                <div className='wallets-transfer-form-amount-input__timer'>
                    <Timer key={toAmount} onComplete={onTimerCompleteHandler} />
                </div>
            )}
        </div>
    );
};

export default TransferFormAmountInput;
