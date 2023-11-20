import React, { useCallback, useEffect, useMemo } from 'react';
import { useFormikContext } from 'formik';
import debounce from 'lodash.debounce';
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
    const isCurrencyEqual = fromAccount?.currency === toAccount?.currency;

    const isFromAmountFieldName = fieldName === 'fromAmount';
    const toAmountLabel = isCurrencyEqual ? 'Amount you receive' : 'Estimated amount';
    const label = isFromAmountFieldName ? 'Amount you send' : toAmountLabel;
    const value = isFromAmountFieldName ? fromAmount : toAmount;
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

    const debouncedAmountConverterHandler = useMemo(
        () =>
            debounce((value: number) => {
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
                    setTimeout(() => setFieldValue('fromAmount', convertedFromAmount));
                }
            }, 500),
        [
            exchangeRate?.rates,
            fromAccount?.currencyConfig?.fractional_digits,
            isFromAmountFieldName,
            setFieldValue,
            toAccount?.currency,
            toAccount?.currencyConfig?.fractional_digits,
        ]
    );

    const onChangeHandler = useCallback(
        (value: number) => {
            if (isCurrencyEqual) {
                setValues(prev => ({ ...prev, fromAmount: value, toAmount: value }));
            } else {
                if (value === 0) {
                    debouncedAmountConverterHandler.cancel();
                    setValues(prev => ({ ...prev, fromAmount: 0, toAmount: 0 }));
                    return;
                }
                setFieldValue(fieldName, value);
                debouncedAmountConverterHandler(value);
            }
        },
        [isCurrencyEqual, setValues, setFieldValue, fieldName, debouncedAmountConverterHandler]
    );

    const onFocusHandler = useCallback(() => {
        setFieldValue('activeAmountFieldName', fieldName);
    }, [fieldName, setFieldValue]);

    return (
        <ATMAmountInput
            currency={currency}
            disabled={isAmountInputDisabled}
            fractionDigits={fractionDigits}
            label={label}
            maxDigits={MAX_DIGITS}
            onChange={fieldName === values.activeAmountFieldName ? onChangeHandler : undefined}
            onFocus={onFocusHandler}
            value={value}
        />
    );
};

export default TransferFormAmountInput;
