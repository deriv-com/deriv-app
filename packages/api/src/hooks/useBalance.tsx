import { useMemo } from 'react';
import useFetch from '../useFetch';

/** A custom hook that gets the balance for all the user accounts. */
const useBalance = () => {
    const { data: balance_data, ...rest } = useFetch('balance', {
        payload: { account: 'all' }, // For 'all' account payload, balance is not subscribe-able, but when passed loginid, it is subscribe-able
        options: {
            refetchInterval: 30000,
        },
    });

    // Add additional information to the balance data.
    const modified_balance = useMemo(() => ({ ...balance_data?.balance }), [balance_data?.balance]);

    return {
        data: modified_balance,
        ...rest,
    };
};

export default useBalance;
