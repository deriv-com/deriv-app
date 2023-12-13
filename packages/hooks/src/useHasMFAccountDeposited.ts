import { useQuery } from '@deriv/api';
import { useCallback, useMemo } from 'react';

/** A custom hook to check whether the current mf account has deposited based on status in account_status */
const useHasMFAccountDeposited = () => {
    /** Check if the status contains one of the expected status
     * @param {string[]} status - status from account_status
     * @returns {boolean} - true if status contains one of the expected status
     */
    const hasDeposited = useCallback((status?: string[]) => {
        const expected_status = ['withdrawal_locked', 'cashier_locked'];
        return status?.some(status => expected_status.includes(status)) ?? false;
    }, []);
    const { data, ...rest } = useQuery('get_account_status', {
        options: {
            /** Refetch account_status every 2 seconds if expected status is not in response.
             *  This is need to be done because OneTimeDepositModal will be closed based on those status
             */
            refetchInterval: response => (hasDeposited(response?.get_account_status?.status) ? false : 2000),
        },
    });
    const modified_account_status = useMemo(() => {
        if (!data?.get_account_status?.status) return;
        const has_mf_account_deposited = hasDeposited(data?.get_account_status?.status);
        return {
            ...data.get_account_status,
            has_mf_account_deposited,
        };
    }, [data?.get_account_status, hasDeposited]);
    return {
        data: modified_account_status,
        has_mf_account_deposited: modified_account_status?.has_mf_account_deposited,
        ...rest,
    };
};

export default useHasMFAccountDeposited;
