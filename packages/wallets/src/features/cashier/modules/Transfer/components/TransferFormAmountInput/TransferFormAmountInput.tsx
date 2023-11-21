import React, { useCallback, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { useDebounce } from 'usehooks-ts';
import { useExchangeRate } from '@deriv/api';
import { ATMAmountInput } from '../../../../../../components';
import { useTransfer } from '../../provider';
import type { TInitialTransferFormValues } from '../../types';

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
    const toAmountLabel = isSameCurrency ? 'Amount you receive' : 'Estimated amount';
    const amountLabel = isFromAmountFieldName ? 'Amount you send' : toAmountLabel;
    const currency = isFromAmountFieldName ? fromAccount?.currency : toAccount?.currency;
    const fractionDigits = isFromAmountFieldName
        ? fromAccount?.currencyConfig?.fractional_digits
        : toAccount?.currencyConfig?.fractional_digits;
    const isAmountInputDisabled = fieldName === 'toAmount' && !toAccount;

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
            if (!toAccount?.currency || !exchangeRate?.rates) return;

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
            isFromAmountFieldName,
            setFieldValue,
            toAccount?.currency,
            toAccount?.currencyConfig?.fractional_digits,
        ]
    );

    useEffect(() => {
        if (debouncedAmountValue) amountConverterHandler(debouncedAmountValue);
    }, [amountConverterHandler, debouncedAmountValue]);

    const onChangeHandler = useCallback(
        (value: number) => {
            if (fieldName !== values.activeAmountFieldName) return;
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
        [fieldName, isSameCurrency, setFieldValue, setValues, values.activeAmountFieldName]
    );

    const onFocusHandler = useCallback(() => {
        setFieldValue('activeAmountFieldName', fieldName);
    }, [fieldName, setFieldValue]);

    return (
        <ATMAmountInput
            currency={currency}
            disabled={isAmountInputDisabled}
            fractionDigits={fractionDigits}
            label={amountLabel}
            maxDigits={MAX_DIGITS}
            onChange={onChangeHandler}
            onFocus={onFocusHandler}
            value={amountValue}
        />
    );
};

export default TransferFormAmountInput;
