import { useMemo } from 'react';
import useAuthorizedQuery from '../useAuthorizedQuery';

/** A custom hook that gets the balance for all the user accounts. */
const useBalance = () => {
    const { data: balance_data, ...rest } = useAuthorizedQuery(
        'balance',
        {
            account: 'all',
        },
        {
            // 30 seconds, just enough to avoid duplicated calls, but without freezing it for too long if someone actually wants to update it,
            // though if user wants it to get updated, its likely that they will refresh page, so then its gonna be invalidated anyway
            staleTime: 30 * 1000,
        },
        false
    );

    // Add additional information to the balance data.
    const modified_balance = useMemo(() => ({ ...balance_data?.balance }), [balance_data?.balance]);

    return {
        /** The balance response. */
        data: modified_balance,
        ...rest,
    };
};

export default useBalance;
