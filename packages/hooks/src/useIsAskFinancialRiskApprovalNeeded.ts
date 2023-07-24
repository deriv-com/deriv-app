import { useStore } from '@deriv/stores';
import useIsWithdrawalLimitReached from './useIsWithdrawalLimitReached';

const useIsAskFinancialRiskApprovalNeeded = () => {
    const { modules } = useStore();
    const { is_ask_financial_risk_approval } = modules?.cashier.error || false;

    const { is_10k_withdrawal_limit_reached: is_10K_limit, isSuccess } = useIsWithdrawalLimitReached();

    const is_ask_financial_risk_approval_needed = is_10K_limit && is_ask_financial_risk_approval;

    return { is_ask_financial_risk_approval_needed, isSuccess };
};

export default useIsAskFinancialRiskApprovalNeeded;
