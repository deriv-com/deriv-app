import { useFetch } from '@deriv/api';
import useCheck10kLimit from './useCheck10kLimit';

const useAccountStatus = () => {
    const { data: account_status, ...rest } = useFetch('get_account_status');
    const { is_10k_withdrawal_limit_reached: is_10K_limit } = useCheck10kLimit();

    const get_account_status = account_status?.get_account_status;

    const statuses = {
        status: {
            is_withdrawal_locked: get_account_status?.status?.includes('withdrawal_locked'),
        },
        cashier_validation: {
            is_cashier_locked: get_account_status?.cashier_validation?.includes('cashier_locked_status'),
            is_withdrawal_locked: get_account_status?.cashier_validation?.includes('withdrawal_locked_status'),
            is_system_maintenance: get_account_status?.cashier_validation?.includes('system_maintenance'),
        },
        document: {
            has_poi_submitted: get_account_status?.authentication?.identity?.status !== 'none',
            has_poa_submitted: get_account_status?.authentication?.document?.status !== 'none',
        },
        needs_verification: {
            is_poi_needed: is_10K_limit && get_account_status?.authentication?.identity?.status !== 'verified',
            is_poa_needed:
                is_10K_limit &&
                (get_account_status?.authentication?.needs_verification?.includes('document') ||
                    get_account_status?.authentication?.document?.status !== 'verified'),
        },
    };

    return {
        /**Contains response for `get_account_status` API call.*/
        data: get_account_status,
        /**Contains all the status flags.*/
        statuses,
        ...rest,
    };
};

export default useAccountStatus;
