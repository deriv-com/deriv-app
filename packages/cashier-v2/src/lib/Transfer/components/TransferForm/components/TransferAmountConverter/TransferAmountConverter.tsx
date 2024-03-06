import React, { useState } from 'react';
import clsx from 'clsx';
import { Field, FieldProps } from 'formik';
import { StandaloneArrowDownBoldIcon } from '@deriv/quill-icons';
import { Input, useDevice } from '@deriv-com/ui';
import styles from './TransferAmountConverter.module.scss';

const TransferAmountConverter = ({ errors, values }) => {
    const { isMobile } = useDevice();
    const [isFromInputActive, setIsFromInputActive] = useState(true);

    // console.log('=> Converter - fromAccount', values.fromAccount);
    // console.log('=> Converter - toAccount', values.toAccount);

    const handleFromAmountChange = () => {
        // console.log('*> fromAmount');
    };

    const handleToAmountChange = () => {
        // console.log('*> toAccount');
    };

    return (
        <div className={styles.container}>
            <Field name='fromAmount'>
                {({ field }: FieldProps) => (
                    <Input
                        {...field}
                        error={Boolean(errors.cryptoAmount)}
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
                                error={Boolean(errors.toAccount)}
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
