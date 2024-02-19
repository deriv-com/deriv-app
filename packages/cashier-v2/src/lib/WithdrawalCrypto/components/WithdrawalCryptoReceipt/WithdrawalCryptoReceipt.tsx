import React from 'react';
import { Button, Text } from '@deriv-com/ui';
import { ReceiptScreen } from '../../../../components';
import styles from './WithdrawalCryptoReceipt.module.scss';

const ActionButtons = () => {
    return (
        <div className={styles.actions}>
            <Button
                color='white'
                // onClick={() => history.push('/wallets/cashier/transactions')}
                size='lg'
                textSize='sm'
                variant='outlined'
            >
                View transaction history
            </Button>
            <Button size='lg' textSize='sm'>
                Make a new withdrawal
            </Button>
        </div>
    );
};

const WithdrawalCryptoReceipt: React.FC = () => {
    return (
        <ReceiptScreen
            actionButtons={<ActionButtons />}
            receipt={{
                amount: '57876',
                from: { currency: 'BTC', info: <Text color='less-prominent'>from</Text> },
                title: 'Your withdrawal will be processed within 24 hours',
                to: { currency: 'BTC', info: <Text color='less-prominent'>To</Text> },
            }}
            status='In review'
        />
    );
};

export default WithdrawalCryptoReceipt;
