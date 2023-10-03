import { useFetch } from '@deriv/api';
import { useMemo } from 'react';
import useAuthorize from './useAuthorize';

/** A custom hook that gets the balance for all of the users accounts */
const useBalance = () => {
    const { isSuccess } = useAuthorize();
    const { data: balance_data, ...rest } = useFetch('balance', {
        payload: { account: 'all' },
        // TODO: Add a subscription when we have `BalanceProvider`.
        options: {
            enabled: isSuccess,
        },
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
