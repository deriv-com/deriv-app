import React, { useState } from 'react';
import clsx from 'clsx';
import { Field, FieldProps, useFormikContext } from 'formik';
import { InferType } from 'yup';
import { StandaloneArrowDownBoldIcon } from '@deriv/quill-icons';
import { Input, useDevice } from '@deriv-com/ui';
import { getCryptoFiatConverterValidationSchema, TGetCryptoFiatConverterValidationSchema } from './utils';
import styles from './CryptoFiatConverter.module.scss';

type TGetConvertedAmountParams =
    | TGetCryptoFiatConverterValidationSchema['fromAccount']
    | TGetCryptoFiatConverterValidationSchema['toAccount'];

const getConvertedAmount = (
    amount: number | string,
    source: TGetConvertedAmountParams,
    target: TGetConvertedAmountParams
) => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (!value) return '';

    const fromRate = 1;
    const toRate = 1;

    const convertedValue =
        // eslint-disable-next-line sonarjs/prefer-immediate-return
        !Number.isNaN(value) ? ((value * toRate) / fromRate).toFixed(target.fractionalDigits) : '';

    return convertedValue;
};

type TContext = InferType<ReturnType<typeof getCryptoFiatConverterValidationSchema>>;

const CryptoFiatConverter: React.FC<TGetCryptoFiatConverterValidationSchema> = ({ fromAccount, toAccount }) => {
    const { isMobile } = useDevice();
    const [isFromInputActive, setIsFromInputActive] = useState(true);

    const { errors, setValues } = useFormikContext<TContext>();

    const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const convertedValue = getConvertedAmount(e.target.value, fromAccount, toAccount);

        setValues(currentValues => ({
            ...currentValues,
            fromAmount: e.target.value,
            toAmount: !errors.fromAmount && isFromInputActive ? convertedValue : currentValues.toAmount ?? '',
        }));
    };

    const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const convertedValue = getConvertedAmount(e.target.value, toAccount, fromAccount);

        setValues(currentValues => ({
            ...currentValues,
            fromAmount: !errors.toAmount && !isFromInputActive ? convertedValue : currentValues.fromAmount ?? '',
            toAmount: e.target.value,
        }));
    };

    return (
        <div className={styles.container}>
            <Field name='fromAmount'>
                {({ field }: FieldProps) => (
                    <Input
                        {...field}
                        autoComplete='off'
                        error={Boolean(errors.fromAmount)}
                        isFullWidth={fromAccount.currency !== toAccount.currency}
                        label={`Amount (${fromAccount.currency})`}
                        message={errors.fromAmount}
                        onChange={handleFromAmountChange}
                        onFocus={() => {
                            setIsFromInputActive(true);
                        }}
                        type='text'
                    />
                )}
            </Field>
            {fromAccount.currency !== toAccount.currency && (
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
                                autoComplete='off'
                                error={Boolean(errors.toAmount)}
                                isFullWidth
                                label={`Amount (${toAccount.currency})`}
                                message={errors.toAmount}
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

export default CryptoFiatConverter;
