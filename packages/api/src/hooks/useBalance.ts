import { useMemo } from 'react';
import useFetch from '../useFetch';

/** A custom hook that gets the balance for all the user accounts. */
const useBalance = () => {
    const { data: balance_data, ...rest } = useFetch('balance', {
        payload: { account: 'all' },
        options: { refetchInterval: 30000 }, // Refetch every 30 seconds to simulate subscription.
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
