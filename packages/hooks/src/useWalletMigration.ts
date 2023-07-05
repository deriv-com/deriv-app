import { useCallback } from 'react';
import { useFetch, useInvalidateQuery, useRequest } from '@deriv/api';

/** A custom hook to get the status of wallet_migration API and to start/reset the migration process */
const useWalletMigration = () => {
    const invalidate = useInvalidateQuery();

    /** Make a request to wallet_migration API and onSuccess it will invalidate the cached data  */
    const { mutate } = useRequest('wallet_migration', { onSuccess: () => invalidate('wallet_migration') });

    /** Fetch the wallet_migration API and refetch it every second if the status is in_progress */
    const { data } = useFetch('wallet_migration', {
        payload: { wallet_migration: 'status' },
        options: {
            refetchInterval: response => (response?.wallet_migration?.status === 'in_progress' ? 500 : false),
        },
    });

    const start_migration = useCallback(() => mutate({ payload: { wallet_migration: 'start' } }), [mutate]);

    const reset_migration = useCallback(() => mutate({ payload: { wallet_migration: 'reset' } }), [mutate]);

    return {
        /** The status of the wallet_migration API */
        status: data?.wallet_migration?.status,
        /** A boolean to check if the status is not_eligible */
        is_ineligible: status === 'ineligible',
        /** A boolean to check if the status is eligible */
        is_eligible: status === 'eligible',
        /** A boolean to check if the status is in_progress */
        is_in_progress: status === 'in_progress',
        /** A boolean to check if the status is completed */
        is_migrated: status === 'migrated',
        /** A boolean to check if the status is failed */
        is_failed: status === 'failed',
        /** Sends a request to wallet_migration API to start the migration process */
        start_migration,
        /** Sends a request to wallet_migration API to reset the migration process */
        reset_migration,
    };
};

export default useWalletMigration;
