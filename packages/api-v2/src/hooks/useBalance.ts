import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuthorize from './useAuthorize';
import useAPI from '../useAPI';

/** A custom hook that gets the balance for all the user accounts. */
const useBalance = () => {
    const { isSuccess, isLoading, data } = useAuthorize();
    const { send } = useAPI();

    // balance data needs to be relaoded when the account list changes, thus we use the account_list length as a dependency
    const { data: balance_data, ...rest } = useQuery(['balance', data?.account_list?.length], () => {
        // @ts-ignore
        return send('balance', { account: 'all' });
    }, {
        enabled: isSuccess && !isLoading,
        // 30 seconds, just enough to avoid duplicated calls, but without freezeing it for too long
        // arguably, it would be beneficial to have a longer stale time, but it's not critical and safer to keep it shorter
        staleTime: 30 * 1000, 
    });

    const modified_balance = useMemo(() => ({ ...balance_data?.balance }), [balance_data?.balance]);

    return {
        /** The balance response. */
        data: modified_balance,
        ...rest,
    };
};

export default useBalance;
