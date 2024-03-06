import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Field, FieldProps } from 'formik';
import { useGetExchangeRate } from '@deriv/api-v2';
import { StandaloneArrowDownBoldIcon } from '@deriv/quill-icons';
import { Input, useDevice } from '@deriv-com/ui';
import styles from './TransferAmountConverter.module.scss';

const getConvertedAmount = (amount: number | string, source, target, exchangeRates) => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    // console.log('=> getConvertedAmount - value', value);
    // console.log(
    //     '=> getConvertedAmount - rates',
    //     exchangeRates,
    //     ', to',
    //     target.currency,
    //     exchangeRates[target.currency],
    //     ', from',
    //     source.currency,
    //     exchangeRates[source.currency]
    // );

    const fromRate = source.currency !== 'USD' ? exchangeRates[source.currency] : 1; // base_currency for the API call is USD
    const toRate = exchangeRates[target.currency];

    const convertedValue =
        // eslint-disable-next-line sonarjs/prefer-immediate-return
        !Number.isNaN(value) ? ((value * toRate) / fromRate).toFixed(target.currencyConfig.fractional_digits) : '';

    // console.log('=> getConvertedAmount - convertedValue', convertedValue);
    return convertedValue;
};

const TransferAmountConverter = ({ errors, setValues, values }) => {
    const { isMobile } = useDevice();
    const [isFromInputActive, setIsFromInputActive] = useState(true);
    const { data: exchangeRates, refetch } = useGetExchangeRate({
        base_currency: 'USD',
    });

    const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const convertedValue = getConvertedAmount(
            e.target.value,
            values.fromAccount,
            values.toAccount,
            exchangeRates?.rates
        );
        setValues((currentValues: typeof values) => ({
            ...currentValues,
            fromAmount: e.target.value,
            toAmount: !errors.fromAccount && isFromInputActive ? convertedValue : '',
        }));
    };

    const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const convertedValue = getConvertedAmount(
            e.target.value,
            values.toAccount,
            values.fromAccount,
            exchangeRates?.rates
        );
        setValues((currentValues: typeof values) => ({
            ...currentValues,
            fromAmount: !errors.toAccount && !isFromInputActive ? convertedValue : '',
            toAmount: e.target.value,
        }));
    };

    return (
        <div className={styles.container}>
            <Field name='fromAmount'>
                {({ field }: FieldProps) => (
                    <Input
                        {...field}
                        error={Boolean(errors.fromAmount)}
                        isFullWidth={values.fromAccount.currency !== values.toAccount.currency}
                        label={`Amount (${values.fromAccount.currency})`}
                        message={errors.fromAmount}
                        onChange={handleFromAmountChange}
                        onFocus={() => {
                            setIsFromInputActive(true);
                        }}
                        type='text'
                    />
                )}
            </Field>
            {values.fromAccount.currency !== values.toAccount.currency && (
                <>
                    <div className={styles['arrow-container']}>
                        <StandaloneArrowDownBoldIcon
                            className={clsx(styles['arrow-icon'], { [styles['arrow-icon--rtl']]: isFromInputActive })}
                            iconSize={isMobile ? 'sm' : 'md'}
                        />
                    </div>
                    <Field name='toAmount'>
                        {({ field }: FieldProps) => (
                            <Input
                                {...field}
                                error={Boolean(errors.toAmount)}
                                isFullWidth
                                label={`Amount (${values.toAccount.currency})`}
                                message={errors.toAccount}
                                onChange={handleToAmountChange}
                                onFocus={() => {
                                    setIsFromInputActive(false);
                                }}
                                type='text'
                            />
                        )}
                    </Field>
                </>
            )}
        </div>
    );
};

export default TransferAmountConverter;
