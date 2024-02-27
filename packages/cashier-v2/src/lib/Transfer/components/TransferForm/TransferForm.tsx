import React from 'react';
import { Text } from '@deriv-com/ui';
import { TransferAmountConverter, TransferFormAccountSelection } from './components';
import styles from './TransferForm.module.scss';

const TransferForm = () => {
    return (
        <div className={styles.container}>
            <Text className={styles.title} weight='bold'>
                Transfer between your accounts in Deriv
            </Text>
            <TransferFormAccountSelection />
            <TransferAmountConverter />
        </div>
    );
};

export default TransferForm;
