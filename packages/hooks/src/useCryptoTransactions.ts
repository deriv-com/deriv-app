import { useEffect, useMemo, useState } from 'react';
import { useSubscription } from '@deriv/api';

type TTransaction = NonNullable<
    NonNullable<ReturnType<typeof useSubscription<'cashier_payments'>>['data']>['cashier_payments']
>['crypto'][number];

type TStatus = TTransaction['status_code'];

type TDepositStatus = 'PENDING' | 'CONFIRMED' | 'ERROR';

type TWithdrawalStatus = Exclude<TStatus, TDepositStatus>;

// Since BE sends the `status_code` for both `deposit` and `withdrawal` in the same field,
// Here we modify the BE type to make `status_code` type more specific to the `transaction_type` field.
export type TModifiedTransaction = Omit<TTransaction, 'status_code' | 'transaction_type'> &
    (
        | { transaction_type: 'deposit'; status_code: TDepositStatus }
        | { transaction_type: 'withdrawal'; status_code: TWithdrawalStatus }
    );

/** A custom hook that returns the list of pending crypto transactions for the current user. */
const useCryptoTransactions = (allowToMakeSubscription = true) => {
    const { subscribe, data, ...rest } = useSubscription('cashier_payments');
    const [transactions, setTransactions] = useState<TModifiedTransaction[]>();

    useEffect(() => {
        allowToMakeSubscription && subscribe();
    }, [subscribe, allowToMakeSubscription]);

    useEffect(() => {
        setTransactions(old_transactions => {
            // Get the list of the crypto transactions.
            const new_transactions = data?.cashier_payments?.crypto as TModifiedTransaction[] | undefined;

            // If there are no new transactions, return the old transactions.
            if (!new_transactions) return old_transactions;

            // If there are no old transactions, return the new transactions.
            if (!old_transactions) return new_transactions;

            // Make a copy of the old transactions.
            const updated_transactions = [...old_transactions];

            // For each new transaction, check if it exists in the old transactions.
            new_transactions.forEach(new_transaction => {
                // Find the index of the new transaction in the old transactions if exists.
                const index = updated_transactions.findIndex(
                    old_transaction => old_transaction.id === new_transaction.id
                );

                // If the new transaction does not exist in the old transactions, add it, otherwise update it.
                if (index === -1) {
                    updated_transactions.push(new_transaction);
                } else {
                    updated_transactions[index] = new_transaction;
                }
            });

            // Return the updated transactions.
            return updated_transactions;
        });
    }, [data?.cashier_payments?.crypto]);

    // Add additional information to each transaction.
    const modified_transactions = useMemo(
        () =>
            transactions?.map(transaction => ({
                ...transaction,
                /** Determine if the transaction is a deposit or not. */
                is_deposit: transaction.transaction_type === 'deposit',
                /** Determine if the transaction is a withdrawal or not. */
                is_withdrawal: transaction.transaction_type === 'withdrawal',
            })),
        [transactions]
    );

    // Sort transactions by submit time.
    const sorted_transactions = useMemo(
        () => modified_transactions?.sort((a, b) => b.submit_date - a.submit_date),
        [modified_transactions]
    );

    // Determine if the user has any transactions or not.
    const has_transactions = modified_transactions && modified_transactions.length > 0;

    // Get the last transaction if exists.
    const last_transaction = modified_transactions?.[0];

    return {
        /** List of user transactions sorted by submit time. */
        data: sorted_transactions,
        /** Returns the last transaction if exists. */
        last_transaction,
        /** Determine is the user has any transactions or not. */
        has_transactions,
        subscribe,
        ...rest,
    };
};

export default useCryptoTransactions;
