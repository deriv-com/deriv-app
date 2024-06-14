import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Loader, Text, useDevice } from '@deriv-com/ui';
import { ReceiptScreen } from '../../../../components';
import { TTransferReceipt } from '../../types';
import { TransferAccountIcon } from '../TransferAccountIcon';
import styles from './TransferReceipt.module.scss';

type TProps = TTransferReceipt & {
    resetTransferReceipt: React.Dispatch<React.SetStateAction<TTransferReceipt | undefined>>;
};

const TransferReceipt: React.FC<TProps> = ({ amount, fromAccount, resetTransferReceipt, toAccount }) => {
    const { isMobile } = useDevice();
    const history = useHistory();

    if (!amount || !fromAccount || !toAccount) return <Loader />;

    return (
        <ReceiptScreen
            actionButtons={
                <div className={styles.actions}>
                    <Button
                        onClick={() => history.push('/reports/statement')}
                        size='lg'
                        textSize='sm'
                        variant='outlined'
                    >
                        View transaction details
                    </Button>
                    <Button onClick={() => resetTransferReceipt(undefined)} size='lg' textSize='sm'>
                        Make a new transfer
                    </Button>
                </div>
            }
            amount={`${amount} ${fromAccount?.currency}`}
            fromElement={
                <>
                    <div className={styles['account-info']}>
                        <TransferAccountIcon account={fromAccount} />
                        <Text weight='bold'>{fromAccount.account_type}</Text>
                    </div>
                    <div className={styles['account-id']}>
                        <Text color='less-prominent' size={isMobile ? 'md' : 'sm'}>
                            {fromAccount?.loginid}
                        </Text>
                    </div>
                </>
            }
            title='Your funds have been transferred'
            toElement={
                <>
                    <div className={styles['account-info']}>
                        <TransferAccountIcon account={toAccount} />
                        <Text weight='bold'>{toAccount.account_type}</Text>
                    </div>
                    <div className={styles['account-id']} data-testid='dt_withdrawal_crypto_receipt_address'>
                        <Text color='less-prominent' size={isMobile ? 'md' : 'sm'}>
                            {toAccount.loginid}
                        </Text>
                    </div>
                </>
            }
        />
    );
};

export default TransferReceipt;
