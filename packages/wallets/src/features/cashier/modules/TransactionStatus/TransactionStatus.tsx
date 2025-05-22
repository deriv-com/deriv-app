import React, { useCallback, useEffect } from 'react';
import { useActiveWalletAccount, useCryptoTransactions } from '@deriv/api-v2';
import { LegacyWarningIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Divider, Text } from '@deriv-com/ui';
import { WalletLoader } from '../../../../components';
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

    const isLoading = isTransactionsLoading || isActiveWalletAccountLoading;
    const isError = !!activeWalletAccountError || !!recentTransactionsError;
    const isTransactionStatusSuccessVisible = !isLoading && !isError && wallet;

    const refresh = useCallback(() => {
        unsubscribe();
        resetData();
        subscribe({ payload: { transaction_type: transactionType } });
        refetch();
    }, [refetch, resetData, subscribe, transactionType, unsubscribe]);

    return (
        <div className='wallets-transaction-status'>
            <div className='wallets-transaction-status__header'>
                <Text align='start' size='sm' weight='bold'>
                    <Localize i18n_default_text='Transaction status' />
                </Text>
                {isError && <LegacyWarningIcon fill='var(--status-warning)' iconSize='xs' />}
            </div>
            <Divider color='var(--general-active)' />
            <div className='wallets-transaction-status__body'>
                {isLoading && (
                    <div className='wallets-transaction-status__loader'>
                        <WalletLoader />
                    </div>
                )}
                {isError && !isLoading && <TransactionStatusError refresh={refresh} />}
                {isTransactionStatusSuccessVisible && (
                    <TransactionStatusSuccess
                        transactionType={transactionType}
                        transactions={transactions || []}
                        wallet={wallet}
                    />
                )}
            </div>
        </div>
    );
};

export default TransactionStatus;
