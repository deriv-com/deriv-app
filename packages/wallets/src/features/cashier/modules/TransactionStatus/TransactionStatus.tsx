import React, { useCallback } from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import { WalletButton } from '../../../../components/Base/WalletButton';
import { WalletText } from '../../../../components/Base/WalletText';
import { CryptoTransaction } from './components/CryptoTransaction';
import useRecentTransactions from './hooks/useRecentTransactions';
import './TransactionStatus.scss';

type TTransactionStatus = {
    transactionType?: 'deposit' | 'withdrawal';
};

const TransactionStatus = ({ transactionType }: TTransactionStatus) => {
    const { isLoading, recentTransactions } = useRecentTransactions();
    const { data: wallet } = useActiveWalletAccount();

    const NoTransactionState = useCallback(
        () => (
            <>
                <WalletText size='xs'>No recent transactions.</WalletText>
                <div className='transaction-status-divider' />
            </>
        ),
        []
    );

    const TransactionDetail = useCallback(() => {
        const filteredTransactions =
            recentTransactions?.filter(el => (transactionType === 'deposit' ? el.is_deposit : el.is_withdrawal)) || [];

        return (
            <React.Fragment>
                {filteredTransactions?.slice(0, 3).map((transaction, index) => (
                    <React.Fragment key={transaction.id}>
                        <CryptoTransaction
                            currencyDisplayCode={wallet?.currency_config?.code || ''}
                            key={transaction.id}
                            transaction={transaction}
                        />
                        <div
                            className={
                                index < filteredTransactions.length - 1 && index < 2
                                    ? 'transaction-status-divider__light'
                                    : 'transaction-status-divider'
                            }
                        />
                    </React.Fragment>
                ))}
                {filteredTransactions.length > 3 && (
                    <WalletButton className='transaction-status-button' color='white' onClick={() => {}} size='sm'>
                        View more
                    </WalletButton>
                )}
                {filteredTransactions.length === 0 && <NoTransactionState />}
            </React.Fragment>
        );
    }, [NoTransactionState, recentTransactions, transactionType, wallet?.currency_config?.code]);

    return (
        <div className='transaction-status-container'>
            <WalletText size='md' weight='bold'>
                Transaction status
            </WalletText>
            <div className='transaction-status-divider' />
            {!isLoading && <TransactionDetail />}
        </div>
    );
};

export default TransactionStatus;
