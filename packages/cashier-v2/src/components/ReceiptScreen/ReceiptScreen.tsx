import React from 'react';
import { Text } from '@deriv-com/ui';
import ArrowDown from '../../assets/images/back-arrow.svg';
import styles from './ReceiptScreen.module.scss';

type TProps = {
    actionButtons?: React.ReactNode;
    amount?: string;
    currency?: string;
    fromElement?: React.ReactNode;
    status?: string;
    title?: string;
    toElement?: React.ReactNode;
};

const ReceiptScreen: React.FC<TProps> = ({
    actionButtons,
    amount,
    currency,
    fromElement,
    status,
    title,
    toElement,
}) => {
    return (
        <div className={styles.container}>
            <Text align='center' as='span' weight='bold'>
                {title}
            </Text>
            {status && (
                <div className={styles.status}>
                    <div className={styles['status-dot']} />
                    <Text align='center' as='span' size='sm' weight='bold'>
                        {status}
                    </Text>
                </div>
            )}
            <div className={styles['transaction-details']}>
                <Text align='center' color='success' size='2xl' weight='bold'>
                    {amount} {currency}
                </Text>
                <div className={styles.account}>{fromElement}</div>
                <div className={styles['arrow-down']}>
                    <ArrowDown />
                </div>
                <div className={styles.account}>{toElement}</div>
            </div>
            {actionButtons}
        </div>
    );
};

export default ReceiptScreen;
