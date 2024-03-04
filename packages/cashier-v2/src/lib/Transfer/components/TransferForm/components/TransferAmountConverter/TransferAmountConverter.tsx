import React, { useState } from 'react';
import clsx from 'clsx';
import { Field, FieldProps, useFormikContext } from 'formik';
import { StandaloneArrowDownBoldIcon } from '@deriv/quill-icons';
import { Input, Text, useDevice } from '@deriv-com/ui';
import { getTransferValidationSchema } from '../../../../utils';
import styles from './TransferAmountConverter.module.scss';

const TransferAmountConverter = ({ fromAccount, toAccount }) => {
    const { isMobile } = useDevice();
    const [isFromInputActive, setIsFromInputActive] = useState(true);
    const { errors, handleChange } = useFormikContext();

    return (
        <div className={styles.container}>
            <Field name='fromAmount'>
                {({ field }: FieldProps) => (
                    <Input
                        {...field}
                        error={Boolean(errors.cryptoAmount)}
                        isFullWidth={fromAccount.currency !== toAccount.currency}
                        label={`Amount (${fromAccount.currency})`}
                        message={errors.fromAmount}
                        onChange={handleChange}
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
                                error={Boolean(errors.cryptoAmount)}
                                isFullWidth
                                label={`Amount (${toAccount.currency})`}
                                message={errors.toAmount ?? 'Approximate Values'}
                                onChange={handleChange}
                                onFocus={() => {
                                    setIsFromInputActive(false);
                                }}
                            />
                        )}
                    </Field>
                </>
            )}
        </div>
    );
};

export default TransferAmountConverter;
