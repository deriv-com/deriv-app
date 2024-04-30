import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Field, FieldProps, useFormikContext } from 'formik';
import { InferType } from 'yup';
import { StandaloneArrowDownBoldIcon } from '@deriv/quill-icons';
import { Input, Text, useDevice } from '@deriv-com/ui';
import { THooks } from '../../hooks/types';
import { PercentageSelector } from '../PercentageSelector';
import { getCryptoFiatConverterValidationSchema, TGetCryptoFiatConverterValidationSchema } from './utils';
import styles from './CryptoFiatConverter.module.scss';

type TContext = InferType<ReturnType<typeof getCryptoFiatConverterValidationSchema>>;

type TCryptoFiatConverter = TGetCryptoFiatConverterValidationSchema & {
    exchangeRates?: THooks.ExchangeRatesSubscribable;
};

type TGetConvertedAmountParams =
    | TGetCryptoFiatConverterValidationSchema['fromAccount']
    | TGetCryptoFiatConverterValidationSchema['toAccount'];

const getConvertedAmount = (amount: string, target: TGetConvertedAmountParams, rate?: number) => {
    const value = Number(amount);

    if (!value || !rate) return '';

    const convertedValue =
        // eslint-disable-next-line sonarjs/prefer-immediate-return
        (value * rate).toFixed(target.fractionalDigits);

    return convertedValue;
};

const CryptoFiatConverter: React.FC<TCryptoFiatConverter> = ({ exchangeRates, fromAccount, toAccount }) => {
    const { isMobile } = useDevice();
    const [isFromInputField, setIsFromInputField] = useState<boolean>(true);
    const { errors, setFieldValue, setValues, values } = useFormikContext<TContext>();
    const percentage =
        fromAccount.balance && Number(values.fromAmount) && !errors.fromAmount
            ? Math.round((Number(values.fromAmount) * 100) / fromAccount.balance)
            : 0;
    const fromRate = exchangeRates?.rates ? exchangeRates?.rates[toAccount.currency] : 0;
    const toRate = exchangeRates?.rates ? 1 / exchangeRates?.rates[toAccount.currency] : 0;

    const isDifferentCurrency = fromAccount.currency !== toAccount.currency;

    useEffect(() => {
        if (isDifferentCurrency && errors.toAmount && !isFromInputField) {
            setFieldValue('fromAmount', '');
        }
    }, [isDifferentCurrency, errors.toAmount, isFromInputField, setFieldValue]);

    useEffect(() => {
        if (isDifferentCurrency && errors.fromAmount && isFromInputField) {
            setFieldValue('toAmount', '');
        }
    }, [isDifferentCurrency, errors.fromAmount, isFromInputField, setFieldValue]);

    const handlePercentageChange = useCallback(
        (per: number) => {
            const computedAmount =
                ((Number(fromAccount.balance) * per) / 100).toFixed(fromAccount.fractionalDigits) ?? 0;
            // Here we take value of fromAmount field for conversion.
            const convertedAmount = getConvertedAmount(computedAmount, toAccount, fromRate);

            setValues(currentValues => ({
                ...currentValues,
                fromAmount: computedAmount,
                toAmount: convertedAmount,
            }));
        },
        [fromAccount.balance, fromAccount.fractionalDigits, fromRate, setValues, toAccount]
    );

    const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const convertedValue = getConvertedAmount(e.target.value, toAccount, fromRate);
        setValues(currentValues => ({
            ...currentValues,
            fromAmount: e.target.value,
            toAmount: convertedValue,
        }));
    };

    const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const convertedValue = getConvertedAmount(e.target.value, fromAccount, toRate);

        setValues(currentValues => ({
            ...currentValues,
            fromAmount: convertedValue,
            toAmount: e.target.value,
        }));
    };

    return (
        <div className={styles.container}>
            {isDifferentCurrency && (
                <div
                    className={styles['percentage-selector-container']}
                    data-testid='dt_crypto_fiat_converter_percentage_selector'
                >
                    <PercentageSelector
                        amount={!errors.fromAmount ? Number(values.fromAmount) : 0}
                        balance={Number(fromAccount.balance)}
                        onChangePercentage={handlePercentageChange}
                    />
                    <Text as='div' color='less-prominent' size='xs'>
                        {`${percentage}% of available balance (${fromAccount.displayBalance})`}
                    </Text>
                </div>
            )}
            <div className={styles['input-container']}>
                <Field name='fromAmount'>
                    {({ field }: FieldProps) => (
                        <Input
                            {...field}
                            autoComplete='off'
                            data-testid='dt_crypto_fiat_converter_from_amount_field'
                            error={Boolean(errors.fromAmount)}
                            isFullWidth={fromAccount.currency !== toAccount.currency}
                            label={`Amount (${fromAccount.currency})`}
                            message={errors.fromAmount}
                            onChange={handleFromAmountChange}
                            onFocus={() => {
                                setIsFromInputField(true);
                            }}
                            type='text'
                        />
                    )}
                </Field>
                {isDifferentCurrency && (
                    <>
                        <div className={styles['arrow-container']} data-testid='dt_crypto_fiat_converter_arrow_icon'>
                            <StandaloneArrowDownBoldIcon
                                className={clsx(styles['arrow-icon'], {
                                    [styles['arrow-icon--rtl']]: isFromInputField,
                                })}
                                iconSize={isMobile ? 'sm' : 'md'}
                            />
                        </div>
                        <Field name='toAmount'>
                            {({ field }: FieldProps) => (
                                <Input
                                    {...field}
                                    autoComplete='off'
                                    data-testid='dt_crypto_fiat_converter_to_amount_field'
                                    error={Boolean(errors.toAmount)}
                                    isFullWidth
                                    label={`Amount (${toAccount.currency})`}
                                    message={errors.toAmount ?? 'Approximate value'}
                                    onChange={handleToAmountChange}
                                    onFocus={() => {
                                        setIsFromInputField(false);
                                    }}
                                    type='text'
                                />
                            )}
                        </Field>
                    </>
                )}
            </div>
        </div>
    );
};

export default CryptoFiatConverter;
