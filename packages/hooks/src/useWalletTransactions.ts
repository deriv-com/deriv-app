import { useEffect, useMemo, useState } from 'react';
import { usePaginatedFetch, useCurrencyConfig } from '@deriv/api';
import useActiveWalletAccount from './useActiveWalletAccount';
import useWalletAccountsList from './useWalletAccountsList';
import useAccountsList from './useAccountsList';

/** A custom hook to get a list of transactions for an active wallet of a user, optionally filtered by transaction type */
const useWalletTransactions = (action_type?: 'deposit' | 'withdrawal' | 'virtual_credit' | 'transfer') => {
    const { data: accounts } = useAccountsList();
    const { data: wallets } = useWalletAccountsList();
    const current_wallet = useActiveWalletAccount();
    const { getConfig } = useCurrencyConfig();
    const loginid = current_wallet?.loginid;

    // Get the paginated and filtered list of transactions from the API.
    const { data, ...rest } = usePaginatedFetch('statement', {
        payload: {
            action_type,
        },
        options: {
            cacheTime: 0,
        },
    });

    // Maintain a list of transactions.
    const [transactions, setTransactions] = useState<
        Required<Required<NonNullable<typeof data>>['statement']>['transactions']
    >([]);

    // Maintain a flag to indicate if the list of transactions is complete.
    const [is_end_of_transaction_list, setIsEndOfTransactionList] = useState(false);

    // Reset the list of transactions when the transaction type changes.
    useEffect(() => {
        setIsEndOfTransactionList(false);
        setTransactions([]);
    }, [action_type]);

    // Add new transactions to the list of transactions when `usePaginatedFetch` returns new ones.
    useEffect(() => {
        const new_transactions = data?.statement?.transactions;
        if (new_transactions)
            setTransactions(prev =>
                [...prev, ...(new_transactions || [])]
                    .sort((a, b) => (b.transaction_id || 0) - (a.transaction_id || 0))
                    .filter((item, pos, arr) => !pos || item.transaction_id != arr[pos - 1].transaction_id)
                    .sort((a, b) => (b.transaction_time || 0) - (a.transaction_time || 0))
            );
        if (new_transactions?.length === 0) setIsEndOfTransactionList(true);
    }, [data?.statement?.transactions]);

    // Add additional information to each transaction.
    const modified_transactions = useMemo(
        () =>
            wallets && current_wallet
                ? transactions
                      // Filter out transactions with undefined `action_type`, `amount`, or `balance_after`.
                      .filter(
                          (
                              transaction: typeof transactions[number]
                          ): transaction is Omit<
                              typeof transactions[number],
                              'action_type' | 'amount' | 'balance_after'
                          > & {
                              action_type: Exclude<typeof transactions[number]['action_type'], undefined>;
                              amount: Exclude<typeof transactions[number]['amount'], undefined>;
                              balance_after: Exclude<typeof transactions[number]['balance_after'], undefined>;
                          } =>
                              transaction.action_type !== undefined &&
                              transaction.amount !== undefined &&
                              transaction.balance_after !== undefined
                      )
                      .map(transaction => {
                          if (transaction.action_type === 'transfer') {
                              const other_loginid =
                                  transaction.to?.loginid === loginid
                                      ? transaction.from?.loginid
                                      : transaction.to?.loginid;
                              if (!other_loginid) return null;
                              const other_account = accounts?.find(el => el?.loginid === other_loginid);
                              if (!other_account || !other_account.currency || !other_account.account_type) return null;
                              return {
                                  ...other_account,
                                  ...transaction,
                                  /** The currency config of a trading account that was part of the transfer to/from the wallet. */
                                  account_currency_config: getConfig(other_account.currency),
                              };
                          }

                          return {
                              ...current_wallet,
                              ...transaction,
                              /** The currency config of the active wallet. */
                              account_currency_config: getConfig(current_wallet?.currency || ''),
                              /** Landing company shortcode the account belongs to. */
                              landing_company_shortcode: undefined,
                          };
                      })
                      .filter(<T>(value: T | null): value is T => value !== null)
                : [],
        [accounts, current_wallet, getConfig, loginid, transactions, wallets]
    );

    return {
        /** List of transactions of the active wallet of the current user. */
        transactions: modified_transactions,
        /** Indicating whether this list in question is complete. */
        isComplete: is_end_of_transaction_list,
        ...rest,
    };
};

export default useWalletTransactions;
