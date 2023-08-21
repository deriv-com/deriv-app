import { useFetch } from '@deriv/api';
import { useMemo } from 'react';

/** A custom hook that gets the balance for user accounts.
 * If no account argument is provided, by default the hook will return the balance of all accounts.
 *
 * @param account {string} - If set to 'all', return the balances of all accounts one by one.
 *                           If set to 'current', return the balance of current account.
 *                           If set as an account id, return the balance of that account.
 *                           Default is set to 'all'.
 */
const useBalance = (account?: string) => {
    const { data: balance_data, ...rest } = useFetch('balance', {
        payload: { account: account ?? 'all' },
        // TODO: Add a subscription when we have `BalanceProvider`.
    });

    // Add additional information to the balance data.
    const modified_balance = useMemo(() => ({ ...balance_data?.balance }), [balance_data?.balance]);

    return {
        /** The balance response. */
        data: modified_balance,
        ...rest,
    };
};

export default useBalance;
