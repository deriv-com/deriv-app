import React, { useCallback, useEffect, useMemo } from 'react';
import { useActiveWalletAccount, useCryptoTransactions } from '@deriv/api';
import { Divider, WalletText } from '../../../../components/Base';
import { WalletsTransactionStatusLoader } from '../../../../components';
import Warning from '../../../../public/images/warning.svg';
import { THooks } from '../../../../types';
import { TransactionStatusError } from './components/TransactionStatusError';
import { TransactionStatusSuccess } from './components/TransactionStatusSuccess';
import './TransactionStatus.scss';

type TTransactionStatus = {
    transactionType?: THooks.CryptoTransactions['transaction_type'];
};

const TransactionStatus: React.FC<TTransactionStatus> = ({ transactionType }) => {
    const {
        data: transactions,
        error: recentTransactionsError,
        isLoading: isTransactionsLoading,
        resetData,
        subscribe,
        unsubscribe,
    } = useCryptoTransactions();
    const {
        data: wallet,
        error: activeWalletAccountError,
        isLoading: isActiveWalletAccountLoading,
        refetch,
    } = useActiveWalletAccount();

    useEffect(() => {
        subscribe({ payload: { transaction_type: transactionType } });
        return () => unsubscribe();
    }, [subscribe, transactionType, unsubscribe]);

    const isLoading = useMemo(
        () => isTransactionsLoading || isActiveWalletAccountLoading,
        [isTransactionsLoading, isActiveWalletAccountLoading]
    );

    const isError = useMemo(
        () => !!activeWalletAccountError || !!recentTransactionsError,
        [activeWalletAccountError, recentTransactionsError]
    );

    const refresh = useCallback(() => {
        unsubscribe();
        resetData();
        subscribe({ payload: { transaction_type: transactionType } });
        refetch();
    }, [refetch, resetData, subscribe, transactionType, unsubscribe]);

    return (
        <div className='wallets-transaction-status'>
            <div className='wallets-transaction-status__header'>
                <WalletText weight='bold'>Transaction status</WalletText>
                {isError && <Warning />}
            </div>
            <Divider color='#d6dadb' /> {/* --color-grey-5 */}
            <div className='wallets-transaction-status__body'>
                {!isError && isLoading && <WalletsTransactionStatusLoader />}
                {isError && <TransactionStatusError refresh={refresh} />}
                {!isLoading && !isError && wallet && transactions && (
                    <TransactionStatusSuccess
                        transactionType={transactionType}
                        transactions={transactions}
                        wallet={wallet}
                    />
                )}
            </div>
        </div>
    );
};

export default TransactionStatus;
