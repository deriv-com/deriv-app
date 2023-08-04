import { useFetch } from '@deriv/api';
import { useMemo } from 'react';

/** A custom hook that gets the balance for all of the users accounts */
const useBalance = () => {
    const { data: balance_data, ...rest } = useFetch('balance', {
        payload: { account: 'all' },
        // Updating the balance every 5 seconds, This will be replaced by a subscription when we have `BalanceProvider`.
        // options: { refetchInterval: 5000 },
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
