import { useStore } from '@deriv/stores';
import { useFetch } from '@deriv/api';
import useCheck10kLimit from './useCheck10kLimit';
import useAccountStatus from './useAccountStatus';

type TUseWithdrawalLocked = {
    is_withdrawal_locked: boolean;
    is_poi_needed: boolean;
    has_poi_submitted: boolean;
    is_poa_needed: boolean;
    has_poa_submitted: boolean;
    is_ask_financial_risk_approval_needed: boolean;
    isLoading: boolean;
    isSuccess: boolean;
};

const useWithdrawalLocked = (): TUseWithdrawalLocked => {
    const { modules } = useStore();
    const { data: get_account_status, statuses, isLoading, isSuccess } = useAccountStatus();

    const { is_10k_withdrawal_limit_reached: is_10K_limit } = useCheck10kLimit();

    const { is_ask_authentication, is_ask_financial_risk_approval } = modules?.cashier.error;

    const status = get_account_status?.status;
    const authentication = get_account_status?.authentication;
    const need_poi = authentication?.needs_verification.includes('identity');
    const need_authentication = is_ask_authentication && need_poi;
    const is_withdrawal_lock_status = statuses?.status.is_withdrawal_locked;

    const is_withdrawal_locked =
        status && (is_withdrawal_lock_status || need_authentication || is_ask_financial_risk_approval);

    const is_poi_needed = statuses?.needs_verification?.is_poi_needed;
    const has_poi_submitted = statuses?.document?.has_poi_submitted;
    const is_poa_needed = statuses?.needs_verification?.is_poa_needed;
    const has_poa_submitted = statuses?.document?.has_poa_submitted;
    const is_ask_financial_risk_approval_needed = is_10K_limit && is_ask_financial_risk_approval;

    return {
        is_withdrawal_locked,
        is_poi_needed,
        has_poi_submitted,
        is_poa_needed,
        has_poa_submitted,
        is_ask_financial_risk_approval_needed,
        isLoading,
        isSuccess,
    };
};

export default useWithdrawalLocked;
