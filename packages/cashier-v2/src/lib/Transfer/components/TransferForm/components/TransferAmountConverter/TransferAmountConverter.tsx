import React, { useState } from 'react';
import clsx from 'clsx';
import { Field, FieldProps } from 'formik';
import { StandaloneArrowDownBoldIcon } from '@deriv/quill-icons';
import { Input, useDevice } from '@deriv-com/ui';
import styles from './TransferAmountConverter.module.scss';

const TransferAmountConverter = ({ errors, setValues, values }) => {
    const { isMobile } = useDevice();
    const [isFromInputActive, setIsFromInputActive] = useState(true);

    // console.log('=> Converter - fromAccount', values.fromAccount);
    // console.log('=> Converter - toAccount', values.toAccount);

    const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues((currentValues: typeof values) => ({
            ...currentValues,
            fromAmount: e.target.value,
            toAmount: !errors.fromAccount && e.target.value ? currentValues.fromAmount : '',
        }));
    };

    const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues((currentValues: typeof values) => ({
            ...currentValues,
            fromAmount: !errors.toAccount && e.target.value ? currentValues.toAmount : '',
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
