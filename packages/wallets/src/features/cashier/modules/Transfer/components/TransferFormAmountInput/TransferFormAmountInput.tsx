import React, { useCallback, useEffect, useMemo } from 'react';
import { useFormikContext } from 'formik';
import { useDebounce } from 'usehooks-ts';
import { ATMAmountInput, Timer } from '../../../../../../components';
import useInputDecimalFormatter from '../../../../../../hooks/useInputDecimalFormatter';
import { useTransfer } from '../../provider';
import type { TInitialTransferFormValues } from '../../types';
import './TransferFormAmountInput.scss';

type TProps = {
    fieldName: 'fromAmount' | 'toAmount';
};

const MAX_DIGITS = 12;
const USD_MAX_POSSIBLE_TRANSFER_AMOUNT = 100_000;

const TransferFormAmountInput: React.FC<TProps> = ({ fieldName }) => {
    const { setFieldValue, setValues, values } = useFormikContext<TInitialTransferFormValues>();
    const { fromAccount, fromAmount, toAccount, toAmount } = values;

    const { USDExchangeRates, activeWalletExchangeRates, refetchAccountLimits, refetchExchangeRates } = useTransfer();

    const refetchExchangeRatesAndLimits = useCallback(() => {
        refetchAccountLimits();
        const newRates = refetchExchangeRates();

        return newRates;
    }, [refetchAccountLimits, refetchExchangeRates]);

    const isFromAmountFieldName = fieldName === 'fromAmount';
    const isSameCurrency = fromAccount?.currency === toAccount?.currency;
    const isAmountInputDisabled = fieldName === 'toAmount' && !toAccount;
    const isAmountFieldActive = fieldName === values.activeAmountFieldName;
    const isTimerVisible = !isFromAmountFieldName && toAccount && !isSameCurrency && fromAmount > 0 && toAmount > 0;

    const amountValue = isFromAmountFieldName ? fromAmount : toAmount;
    const debouncedAmountValue = useDebounce(amountValue, 500);

    const toAmountLabel = isSameCurrency || !toAccount ? 'Amount you receive' : 'Estimated amount';
    const amountLabel = isFromAmountFieldName ? 'Amount you send' : toAmountLabel;

    const currency = isFromAmountFieldName ? fromAccount?.currency : toAccount?.currency;
    const fractionDigits = isFromAmountFieldName
        ? fromAccount?.currencyConfig?.fractional_digits
        : toAccount?.currencyConfig?.fractional_digits;

    const convertedMaxPossibleAmount = useMemo(
        () => USD_MAX_POSSIBLE_TRANSFER_AMOUNT * (USDExchangeRates?.rates?.[currency ?? 'USD'] ?? 1),
        [USDExchangeRates?.rates, currency]
    );
    const { value: formattedConvertedMaxPossibleAmount } = useInputDecimalFormatter(convertedMaxPossibleAmount, {
        fractionDigits,
    });
    const maxDigits = formattedConvertedMaxPossibleAmount.match(/\d/g)?.length ?? MAX_DIGITS;

    const amountConverterHandler = useCallback(
        (value: number) => {
            if (!toAccount?.currency || !activeWalletExchangeRates?.rates || !isAmountFieldActive) return;

            const toRate = activeWalletExchangeRates.rates[toAccount.currency];

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
            activeWalletExchangeRates?.rates,
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
        refetchExchangeRatesAndLimits().then(res => {
            const newRates = res.data?.exchange_rates;
            if (!newRates?.rates || !toAccount?.currency) return;
            const toRate = newRates.rates[toAccount.currency];
            const convertedToAmount = Number(
                (fromAmount * toRate).toFixed(toAccount?.currencyConfig?.fractional_digits)
            );
            setFieldValue('toAmount', convertedToAmount);
        });
    }, [
        fromAmount,
        refetchExchangeRatesAndLimits,
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
                maxDigits={maxDigits}
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
