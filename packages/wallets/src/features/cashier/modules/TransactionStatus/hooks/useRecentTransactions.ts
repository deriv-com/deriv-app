import { useCallback, useEffect, useMemo } from 'react';
import moment from 'moment';
import { useCryptoTransactions } from '@deriv/api';
import { getTruncatedString } from '@deriv/utils';
import { THooks } from '../../../../../types';
import {
    depositConfirmationDisplayMapper,
    depositStatusColorMapper,
    depositStatusDescriptionMapper,
    depositStatusNameMapper,
    depositTransactionHashDisplayMapper,
    withdrawalConfirmationDisplayMapper,
    withdrawalStatusColorMapper,
    withdrawalStatusDescriptionMapper,
    withdrawalStatusNameMapper,
    withdrawalTransactionHashDisplayMapper,
} from '../utils/transactionDetailsMappers';

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
        () =>
            transactions?.map(transaction => {
                const submitDate = transaction.submit_date;
                const confirmations = transaction.confirmations;
                const addressHash = transaction.address_hash;
                const addressHashObscure = addressHash
                    ? `${getTruncatedString(addressHash, { length: 8, type: 'middle' })}`
                    : 'Pending';
                const transactionHash = transaction.transaction_hash;
                const transactionHashObscure = transactionHash
                    ? `${getTruncatedString(transactionHash, { length: 8, type: 'middle' })}`
                    : 'Pending';

                const statusColor =
                    transaction.transaction_type === 'deposit'
                        ? depositStatusColorMapper[transaction.status_code]
                        : withdrawalStatusColorMapper[transaction.status_code];

                const statusName =
                    transaction.transaction_type === 'deposit'
                        ? depositStatusNameMapper[transaction.status_code]
                        : withdrawalStatusNameMapper[transaction.status_code];

                const statusDescription =
                    transaction.transaction_type === 'deposit'
                        ? depositStatusDescriptionMapper[transaction.status_code]
                        : withdrawalStatusDescriptionMapper[transaction.status_code];

                const transactionHashDisplay =
                    transaction.transaction_type === 'deposit'
                        ? depositTransactionHashDisplayMapper(transactionHashObscure)[transaction.status_code]
                        : withdrawalTransactionHashDisplayMapper(transactionHashObscure)[transaction.status_code];

                const confirmationDisplay =
                    transaction.transaction_type === 'deposit'
                        ? depositConfirmationDisplayMapper(confirmations)[transaction.status_code]
                        : withdrawalConfirmationDisplayMapper[transaction.status_code];

                const submitDateDisplay = moment
                    .unix(submitDate || 0)
                    .utc()
                    .format('MMM D, YYYY');

                return {
                    ...transaction,
                    addressHashDisplay: addressHashObscure,
                    confirmationDisplay,
                    statusColor,
                    statusDescription,
                    statusName,
                    submitDateDisplay,
                    transactionHashDisplay,
                };
            }),
        [transactions]
    );

    return { recentTransactions, refresh, ...rest };
};

export default useRecentTransactions;
