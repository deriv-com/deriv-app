import { useStore } from '@deriv/stores';
import useCheck10kLimit from './useCheck10kLimit';

const useIsAskFinancialRiskApprovalNeeded = () => {
    const { modules } = useStore();
    const { is_ask_financial_risk_approval } = modules?.cashier.error;

    const { is_10k_withdrawal_limit_reached: is_10K_limit, isSuccess } = useCheck10kLimit();

    const is_ask_financial_risk_approval_needed = is_10K_limit && is_ask_financial_risk_approval;

    return { is_ask_financial_risk_approval_needed, isSuccess };
};

export default useIsAskFinancialRiskApprovalNeeded;
