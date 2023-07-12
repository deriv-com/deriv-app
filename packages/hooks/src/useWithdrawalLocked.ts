import { useStore } from '@deriv/stores';
import { useRequest } from '@deriv/api';
import useCheck10kLimit from './useCheck10kLimit';

type TUseWithdrawalLocked = {
    is_withdrawal_locked: boolean;
    is_poi_needed: boolean;
    has_poi_submitted: boolean;
    is_poa_needed: boolean;
    has_poa_submitted: boolean;
    is_ask_financial_risk_approval_needed: boolean;
};

const useWithdrawalLocked = (): TUseWithdrawalLocked => {
    const { modules } = useStore();
    const { withdraw } = modules.cashier;

    const { is_10k_withdrawal_limit_reached: is_10K_limit } = useCheck10kLimit();

    const {
        error: { is_ask_financial_risk_approval },
    } = withdraw;

    const { is_ask_authentication } = modules?.cashier.error;

    const { data: account_status } = useRequest('get_account_status');
    const get_account_status = account_status?.get_account_status;
    const status = get_account_status?.status;
    const authentication = get_account_status?.authentication;
    const document = get_account_status?.authentication?.document;
    const identity = get_account_status?.authentication?.identity;
    const needs_verification = get_account_status?.authentication?.needs_verification;
    const need_poi = authentication?.needs_verification.includes('identity');
    const need_authentication = is_ask_authentication && need_poi;
    const is_withdrawal_lock_status = status?.some(status_name => status_name === 'withdrawal_locked');

    const is_withdrawal_locked =
        status && (is_withdrawal_lock_status || need_authentication || is_ask_financial_risk_approval);

    const is_poi_needed = is_10K_limit && identity?.status !== 'verified';
    const has_poi_submitted = identity?.status !== 'none';
    const is_poa_needed = is_10K_limit && (needs_verification?.includes('document') || document?.status !== 'verified');
    const has_poa_submitted = document?.status !== 'none';
    const is_ask_financial_risk_approval_needed = is_10K_limit && is_ask_financial_risk_approval;

    return {
        is_withdrawal_locked,
        is_poi_needed,
        has_poi_submitted,
        is_poa_needed,
        has_poa_submitted,
        is_ask_financial_risk_approval_needed,
    };
};

export default useWithdrawalLocked;
