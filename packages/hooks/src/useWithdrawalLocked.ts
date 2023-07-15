import { useStore } from '@deriv/stores';
import useCheck10kLimit from './useCheck10kLimit';
import useAccountStatus from './useAccountStatus';

type TUseWithdrawalLocked = {
    is_withdrawal_locked: boolean;
    is_ask_financial_risk_approval_needed: boolean;
    isLoading: boolean;
    isSuccess: boolean;
};

const useWithdrawalLocked = (): TUseWithdrawalLocked => {
    const { modules } = useStore();
    const { is_ask_authentication, is_ask_financial_risk_approval } = modules?.cashier.error;

    const { data: get_account_status, statuses, isLoading, isSuccess } = useAccountStatus();
    const { is_10k_withdrawal_limit_reached: is_10K_limit } = useCheck10kLimit();

    const status = get_account_status?.status;
    const authentication = get_account_status?.authentication;
    const need_poi = authentication?.needs_verification.includes('identity');
    const need_authentication = is_ask_authentication && need_poi;
    const is_withdrawal_lock_status = statuses?.status.is_withdrawal_locked;

    const is_withdrawal_locked =
        (status && (is_withdrawal_lock_status || need_authentication || is_ask_financial_risk_approval)) || false;

    const is_ask_financial_risk_approval_needed = is_10K_limit && is_ask_financial_risk_approval;

    return {
        is_withdrawal_locked,
        is_ask_financial_risk_approval_needed,
        isLoading,
        isSuccess,
    };
};

export default useWithdrawalLocked;
