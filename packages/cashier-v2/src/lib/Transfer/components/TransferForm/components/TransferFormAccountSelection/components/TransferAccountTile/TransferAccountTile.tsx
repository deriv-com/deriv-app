import React from 'react';
import { Text } from '@deriv-com/ui';
import { AccountIcon } from '../../../../../../../../components';
import styles from './TransferAccountTile.module.scss';

const TransferAccountTile = () => {
    return (
        <div className={styles.container}>
            <div className={styles.account}>
                <AccountIcon accountName='Dmt5Cfds' size='sm' />
                <div className={styles['account-info']}>
                    <Text size='sm'>Account Name</Text>
                    <Text color='less-prominent' size='sm'>
                        CR1234
                    </Text>
                </div>
            </div>
            <Text size='sm'>10,000.00 USD</Text>
        </div>
    );
};

export default TransferAccountTile;
