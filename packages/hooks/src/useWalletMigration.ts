import { useCallback } from 'react';
import { useFetch, useInvalidateQuery, useRequest } from '@deriv/api';

const useWalletMigration = () => {
    const invalidate = useInvalidateQuery();

    /** Make a request to wallet_migration API and onSuccess it will invalidate the cached data  */
    const { mutate } = useRequest('wallet_migration', { onSuccess: () => invalidate('wallet_migration') });

    /** Fetch the wallet_migration API and refetch it every second if the status is in_progress */
    const { data } = useFetch('wallet_migration', {
        payload: { wallet_migration: 'status' },
        options: {
            refetchInterval: response => (response?.wallet_migration?.status === 'in_progress' ? 1000 : false),
        },
    });

    const start = useCallback(() => mutate({ payload: { wallet_migration: 'start' } }), [mutate]);

    const reset = useCallback(() => mutate({ payload: { wallet_migration: 'reset' } }), [mutate]);

    return {
        status: data?.wallet_migration?.status,
        start,
        reset,
    };
};

export default useWalletMigration;
