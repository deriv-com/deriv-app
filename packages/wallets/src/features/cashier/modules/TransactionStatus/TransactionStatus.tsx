import React, { useCallback, useMemo } from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import { Divider, WalletText } from '../../../../components/Base';
import { Loader } from '../../../../components/Loader';
import { WalletsTransactionStatusLoader } from '../../../../components';
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
        refresh: refreshRecentTransactions,
    } = useRecentTransactions(transactionType);
    const {
        data: wallet,
        error: activeWalletAccountError,
        isLoading: isActiveWalletAccountLoading,
        refetch,
    } = useActiveWalletAccount();

    const isLoading = useMemo(
        () => isTransactionsLoading || isActiveWalletAccountLoading,
        [isTransactionsLoading, isActiveWalletAccountLoading]
    );

    const isError = useMemo(
        () => !!activeWalletAccountError || !!recentTransactionsError,
        [activeWalletAccountError, recentTransactionsError]
    );

    const refresh = useCallback(() => {
        refreshRecentTransactions();
        refetch();
    }, [refetch, refreshRecentTransactions]);

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
