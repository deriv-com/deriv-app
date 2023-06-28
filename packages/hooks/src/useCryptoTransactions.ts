import { useFetch } from '@deriv/api';
import { useMemo } from 'react';

type TTransaction = NonNullable<
    NonNullable<ReturnType<typeof useFetch<'cashier_payments'>>['data']>['cashier_payments']
>['crypto'][number];

type TDepositStatus = 'PENDING' | 'CONFIRMED' | 'ERROR';

type TWithdrawalStatus =
    | 'LOCKED'
    | 'VERIFIED'
    | 'REJECTED'
    | 'PERFORMING_BLOCKCHAIN_TXN'
    | 'PROCESSING'
    | 'SENT'
    | 'ERROR'
    | 'CANCELLED';

// Since BE sends the `status_code` for both `deposit` and `withdrawal` in the same field,
// Here we modify the BE type to make `status_code` type more specific to the `transaction_type` field.
type TModifiedTransaction = Omit<TTransaction, 'status_code' | 'transaction_type'> &
    (
        | { transaction_type: 'deposit'; status_code: TDepositStatus }
        | { transaction_type: 'withdrawal'; status_code: TWithdrawalStatus }
    );

/** A custom hook that returns the list of crypto transactions for the current user. */
const useCryptoTransactions = () => {
    // Todo: replace `useFetch` with `useSubscription` once we removed `TransactionHistoryStore`.
    // const { subscribe, data, ...rest } = useSubscription('cashier_payments');
    const { data, ...rest } = useFetch('cashier_payments');
    const transactions = data?.cashier_payments?.crypto as TModifiedTransaction[] | undefined;

    const modified_transactions = useMemo(
        () =>
            (transactions || [])
                .map(transaction => ({
                    ...transaction,
                    is_deposit: transaction.transaction_type === 'deposit',
                    is_withdrawal: transaction.transaction_type === 'withdrawal',
                }))
                .sort((a, b) => b.submit_date - a.submit_date),
        [transactions]
    );

    const has_transactions = modified_transactions && modified_transactions.length > 0;
    const last_transactions = has_transactions ? modified_transactions?.[0] : undefined;

    // merge data with subscription data
    // useEffect(() => {
    //     subscribe();
    // }, [subscribe]);

    return {
        /** List of user transactions sorted by submit time. */
        data: modified_transactions,
        /** Returns the last transaction if exists. */
        last_transactions,
        /** Determine is the user has any transactions or not. */
        has_transactions,
        ...rest,
    };
};

export default useCryptoTransactions;
