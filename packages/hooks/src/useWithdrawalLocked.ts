import { useStore } from '@deriv/stores';
import useAccountStatus from './useAccountStatus';

type TUseWithdrawalLocked = {
    is_withdrawal_locked: boolean;
    isLoading: boolean;
    isSuccess: boolean;
};

const useWithdrawalLocked = (): TUseWithdrawalLocked => {
    const { modules } = useStore();
    const { is_ask_authentication, is_ask_financial_risk_approval } = modules?.cashier.error || false;

    const { data: get_account_status, statuses, isLoading, isSuccess } = useAccountStatus();

    const status = get_account_status?.status;
    const authentication = get_account_status?.authentication;
    const need_poi = authentication?.needs_verification.includes('identity');
    const need_authentication = is_ask_authentication && need_poi;
    const is_withdrawal_lock_status = statuses?.status.is_withdrawal_locked;

    const is_withdrawal_locked =
        (status && (is_withdrawal_lock_status || need_authentication || is_ask_financial_risk_approval)) || false;

    return {
        is_withdrawal_locked,
        isLoading,
        isSuccess,
    };
};

export default useWithdrawalLocked;
