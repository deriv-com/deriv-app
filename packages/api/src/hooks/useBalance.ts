import { useMemo } from 'react';
import useQuery from '../useQuery';
import useAuthorize from './useAuthorize';

/** A custom hook that gets the balance for all the user accounts. */
const useBalance = () => {
    const { isSuccess, isLoading: isAuthorizeLoading } = useAuthorize();
    const {
        data: balance_data,
        isLoading: isBalanceLoading,
        ...rest
    } = useQuery('balance', {
        payload: { account: 'all' },
        options: {
            enabled: isSuccess,
            refetchInterval: 30000, // Refetch every 30 seconds to simulate subscription.
        },
    });

    // Add additional information to the balance data.
    const modified_balance = useMemo(() => ({ ...balance_data?.balance }), [balance_data?.balance]);

    return {
        /** The balance response. */
        data: modified_balance,
        isLoading: isAuthorizeLoading || isBalanceLoading,
        ...rest,
    };
};

export default useBalance;
