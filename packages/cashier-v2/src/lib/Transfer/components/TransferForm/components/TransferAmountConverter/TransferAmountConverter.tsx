import React, { useState } from 'react';
import clsx from 'clsx';
import { Field } from 'formik';
import { StandaloneArrowDownBoldIcon } from '@deriv/quill-icons';
import { Input, Text, useDevice } from '@deriv-com/ui';
import styles from './TransferAmountConverter.module.scss';

const TransferAmountConverter = ({ fromAccount, toAccount }) => {
    const { isMobile } = useDevice();
    const [isFromInputActive, setIsFromInputActive] = useState(true);

    return (
        <div className={styles.container}>
            <Field name='fromAmount'>
                {({ field }) => (
                    <Input
                        isFullWidth={fromAccount.currency !== toAccount.currency}
                        label={`Amount (${fromAccount.currency})`}
                        message={
                            <Text color='less-prominent' size={isMobile ? 'sm' : 'xs'}>
                                Approximate Values
                            </Text>
                        }
                        onFocus={() => {
                            setIsFromInputActive(true);
                        }}
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
                        {({ field }) => (
                            <Input
                                isFullWidth
                                label={`Amount (${toAccount.currency})`}
                                message={
                                    <Text color='less-prominent' size={isMobile ? 'sm' : 'xs'}>
                                        Approximate Values
                                    </Text>
                                }
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
