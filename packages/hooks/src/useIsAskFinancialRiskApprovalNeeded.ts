import { useStore } from '@deriv/stores';
import useIsWithdrawalLimitReached from './useIsWithdrawalLimitReached';

const useIsAskFinancialRiskApprovalNeeded = () => {
    const { modules } = useStore();
    const { is_ask_financial_risk_approval } = modules?.cashier.error || false;

    const is_10K_limit = useIsWithdrawalLimitReached();

    const is_ask_financial_risk_approval_needed = (is_10K_limit && is_ask_financial_risk_approval) || false;

    return is_ask_financial_risk_approval_needed;
};

export default useIsAskFinancialRiskApprovalNeeded;
