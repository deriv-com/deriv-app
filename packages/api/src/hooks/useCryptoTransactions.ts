import { useCallback, useEffect, useMemo, useState } from 'react';
import { getTruncatedString } from '@deriv/utils';
import useSubscription from '../useSubscription';
import useActiveAccount from './useActiveAccount';
import useAuthorize from './useAuthorize';
import { displayMoney } from '../utils';

type TTransaction = NonNullable<
    NonNullable<ReturnType<typeof useSubscription<'cashier_payments'>>['data']>['cashier_payments']
>['crypto'][number];

type TStatus = TTransaction['status_code'];

type TDepositStatus = 'PENDING' | 'CONFIRMED' | 'ERROR';

type TWithdrawalStatus = Exclude<TStatus, TDepositStatus>;

// Since BE sends the `status_code` for both `deposit` and `withdrawal` in the same field,
// Here we modify the BE type to make `status_code` type more specific to the `transaction_type` field.
type TModifiedTransaction = Omit<TTransaction, 'status_code' | 'transaction_type'> &
    (
        | { transaction_type: 'deposit'; status_code: TDepositStatus }
        | { transaction_type: 'withdrawal'; status_code: TWithdrawalStatus }
    );

const getFormattedConfirmations = (transaction: TModifiedTransaction) => {
    switch (transaction.status_code) {
        case 'CONFIRMED':
            return 'Confirmed';
        case 'ERROR':
            return 'NA';
        default:
            return transaction.confirmations || 'Pending';
    }
};

const getStatusName = (status_code: TModifiedTransaction['status_code']) => {
    switch (status_code) {
        case 'CONFIRMED':
        case 'SENT':
            return 'Successful';
        case 'ERROR':
        case 'REJECTED':
        case 'REVERTED':
            return 'Unsuccessful';
        case 'PENDING':
        case 'PERFORMING_BLOCKCHAIN_TXN':
        case 'PROCESSING':
        case 'REVERTING':
        case 'VERIFIED':
            return 'In process';
        case 'CANCELLED':
            return 'Cancelled';
        case 'LOCKED':
            return 'In review';
        default:
            return '';
    }
};

/** A custom hook that returns the list of pending crypto transactions for the current user. */
const useCryptoTransactions = () => {
    const { subscribe, data, ...rest } = useSubscription('cashier_payments');
    const [transactions, setTransactions] = useState<TModifiedTransaction[]>();

    const {
        data: { preferred_language },
    } = useAuthorize();

    const { data: account } = useActiveAccount();
    const display_code = account?.currency_config?.display_code || 'USD';
    const fractional_digits = account?.currency_config?.fractional_digits || 2;

    // Reset transactions data
    const resetData = useCallback(() => setTransactions(undefined), []);

    useEffect(() => {
        setTransactions(old_transactions => {
            const new_transactions = data?.cashier_payments?.crypto as TModifiedTransaction[] | undefined;

            if (!new_transactions) return old_transactions;

            if (!old_transactions) return new_transactions;

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

            return updated_transactions;
        });
    }, [data?.cashier_payments?.crypto]);

    // Add additional information to each transaction.
    const modified_transactions = useMemo(() => {
        if (!transactions || !transactions.length) return undefined;

        return transactions.map(transaction => ({
            ...transaction,
            /** Formatted amount */
            formatted_amount: displayMoney(transaction.amount || 0, display_code, {
                fractional_digits,
                preferred_language,
            }),
            /** Formatted transaction hash */
            formatted_transaction_hash: transaction.transaction_hash
                ? getTruncatedString(transaction.transaction_hash, { type: 'middle' })
                : 'NA',
            /** Formatted address hash */
            formatted_address_hash: transaction.address_hash
                ? getTruncatedString(transaction.address_hash, { type: 'middle' })
                : 'NA',
            /** Formatted confirmations status */
            formatted_confirmations: getFormattedConfirmations(transaction),
            /** Determine if the transaction is a deposit or not. */
            is_deposit: transaction.transaction_type === 'deposit',
            /** Determine if the transaction is a withdrawal or not. */
            is_withdrawal: transaction.transaction_type === 'withdrawal',
            /** Status name */
            status_name: getStatusName(transaction.status_code),
        }));
    }, [display_code, fractional_digits, preferred_language, transactions]);

    // Sort transactions by submit time.
    const sorted_transactions = useMemo(
        () => modified_transactions?.sort((a, b) => b.submit_date - a.submit_date),
        [modified_transactions]
    );
    // Get the last transaction if exists.
    const last_transaction = modified_transactions?.[0];

    return {
        /** List of user transactions sorted by submit time. */
        data: sorted_transactions,
        /** Returns the last transaction if exists. */
        last_transaction,
        /** Reset transactions data */
        resetData,
        subscribe,
        ...rest,
    };
};

export default useCryptoTransactions;
