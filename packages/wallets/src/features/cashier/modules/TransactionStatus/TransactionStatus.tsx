import React, { useMemo } from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import { WalletText } from '../../../../components/Base';
import { Loader } from '../../../../components/Loader';
import Warning from '../../../../public/images/warning.svg';
import { THooks } from '../../../../types';
import { TransactionStatusError } from './components/TransactionStatusError';
import { TransactionStatusSuccess } from './components/TransactionStatusSuccess';
import useRecentTransactions from './hooks/useRecentTransactions';
import './TransactionStatus.scss';

type TTransactionStatus = {
    transactionType?: THooks.CryptoTransactions['transaction_type'];
};

const TransactionStatus: React.FC<TTransactionStatus> = ({ transactionType }) => {
    const {
        error: recentTransactionsError,
        isLoading: isTransactionsLoading,
        recentTransactions,
    } = useRecentTransactions();
    const {
        data: wallet,
        error: activeWalletAccountError,
        isLoading: isActiveWalletAccountLoading,
    } = useActiveWalletAccount();

    const isLoading = useMemo(
        () => isTransactionsLoading || isActiveWalletAccountLoading,
        [isTransactionsLoading, isActiveWalletAccountLoading]
    );

    const isError = useMemo(
        () => !!activeWalletAccountError || !!recentTransactionsError,
        [activeWalletAccountError, recentTransactionsError]
    );

    return (
        <div className='transaction-status'>
            <div className='transaction-status__header'>
                <WalletText weight='bold'>Transaction status</WalletText>
                {isError && <Warning />}
            </div>
            <div className='transaction-status__divider' />
            <div className='transaction-status__body'>
                {!isError && isLoading && <Loader color='#85acb0' />}
                {isError && <TransactionStatusError />}
                {!isLoading && !isError && wallet && (
                    <TransactionStatusSuccess
                        recentTransactions={recentTransactions}
                        transactionType={transactionType}
                        wallet={wallet}
                    />
                )}
            </div>
        </div>
    );
};

export default TransactionStatus;
