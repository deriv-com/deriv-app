import React, { useState } from 'react';
import clsx from 'clsx';
import { StandaloneArrowDownBoldIcon } from '@deriv/quill-icons';
import { Input, Text, useDevice } from '@deriv-com/ui';
import styles from './TransferAmountConverter.module.scss';

const TransferAmountConverter = () => {
    const { isMobile } = useDevice();
    const [isFromInputActive, setIsFromInputActive] = useState(true);

    return (
        <div className={styles.container}>
            <Input
                isFullWidth
                message={
                    <Text color='less-prominent' size={isMobile ? 'sm' : 'xs'}>
                        Approximate Values
                    </Text>
                }
                onFocus={() => {
                    setIsFromInputActive(true);
                }}
            />
            <div className={styles['arrow-container']}>
                <StandaloneArrowDownBoldIcon
                    className={clsx(styles['arrow-icon'], { [styles['arrow-icon--rtl']]: isFromInputActive })}
                    iconSize={isMobile ? 'sm' : 'md'}
                />
            </div>
            <Input
                isFullWidth
                message={
                    <Text color='less-prominent' size={isMobile ? 'sm' : 'xs'}>
                        Approximate Values
                    </Text>
                }
                onFocus={() => {
                    setIsFromInputActive(false);
                }}
            />
        </div>
    );
};

export default TransferAmountConverter;
