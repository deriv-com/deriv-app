import { useCallback, useEffect, useMemo } from 'react';
import { useCryptoTransactions } from '@deriv/api';
import { THooks } from '../../../../../types';
import transactionDisplayMapper from '../utils/transactionDisplayMapper';

// This hook is used to populate transactions from `useCryptoTransactions` with data that is needed for the UI.
const useRecentTransactions = (transactionType?: THooks.CryptoTransactions['transaction_type']) => {
    const { data: transactions, resetData, subscribe, unsubscribe, ...rest } = useCryptoTransactions();

    useEffect(() => {
        subscribe({ payload: { transaction_type: transactionType } });
        return () => unsubscribe();
    }, [subscribe, transactionType, unsubscribe]);

    const refresh = useCallback(() => {
        unsubscribe();
        resetData();
        subscribe({ payload: { transaction_type: transactionType } });
    }, [resetData, subscribe, transactionType, unsubscribe]);

    const recentTransactions = useMemo(
        () => transactions?.map(transaction => transactionDisplayMapper(transaction)),
        [transactions]
    );

    return { recentTransactions, refresh, ...rest };
};

export default useRecentTransactions;
