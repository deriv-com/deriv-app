import { useStore } from '@deriv/stores';
import { useFetch } from '@deriv/api';
import useCheck10kLimit from './useCheck10kLimit';

const useWithdrawalLocked = () => {
    const { modules } = useStore();
    const { withdraw } = modules.cashier;
    const { is_10k_withdrawal_limit_reached: is_10K_limit } = useCheck10kLimit();

    const {
        error: { is_ask_financial_risk_approval },
    } = withdraw;

    const { data: account_status, isSuccess, isError } = useFetch('get_account_status');
    const get_account_status = account_status?.get_account_status;
    const document = get_account_status?.authentication?.document;
    const identity = get_account_status?.authentication?.identity;
    const needs_verification = get_account_status?.authentication?.needs_verification;

    const is_poi_needed = is_10K_limit && identity?.status !== 'verified';
    const has_poi_submitted = identity?.status !== 'none';
    const is_poa_needed = is_10K_limit && (needs_verification?.includes('document') || document?.status !== 'verified');
    const has_poa_submitted = document?.status !== 'none';
    const is_ask_financial_risk_approval_needed = is_10K_limit && is_ask_financial_risk_approval;

    return {
        is_poi_needed,
        has_poi_submitted,
        is_poa_needed,
        has_poa_submitted,
        is_ask_financial_risk_approval_needed,
    };
};

export default useWithdrawalLocked;
