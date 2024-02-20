import React from 'react';
import { Button, Text } from '@deriv-com/ui';
import { ReceiptScreen } from '../../../../components';
import { useWithdrawalCryptoContext } from '../../provider';
import styles from './WithdrawalCryptoReceipt.module.scss';

const ActionButtons = () => {
    return (
        <div className={styles.actions}>
            <Button color='white' size='lg' textSize='sm' variant='outlined'>
                View transaction history
            </Button>
            <Button size='lg' textSize='sm'>
                Make a new withdrawal
            </Button>
        </div>
    );
};

const WithdrawalCryptoReceipt: React.FC = () => {
    const { withdrawalReceipt } = useWithdrawalCryptoContext();
    const { address, amount, fromAccount } = withdrawalReceipt;

    return (
        <ReceiptScreen
            actionButtons={<ActionButtons />}
            receipt={{
                amount,
                from: {
                    currency: fromAccount?.currency,
                    info: <Text color='less-prominent'>{fromAccount?.loginid}</Text>,
                },
                to: {
                    currency: 'BTC',
                    info: (
                        <div className={styles.address}>
                            <Text color='less-prominent'>{address}</Text>
                            <div>clipboard</div>
                        </div>
                    ),
                },
            }}
            status='In review'
            title='Your withdrawal will be processed within 24 hours'
        />
    );
};

export default WithdrawalCryptoReceipt;
