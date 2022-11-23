import { useStore } from './useStore';

const useNeedFinancialAssessment = () => {
    const { client } = useStore();
    const { is_financial_account, is_financial_information_incomplete, is_trading_experience_incomplete } = client;
    const is_need_financial_assessment =
        is_financial_account && (is_financial_information_incomplete || is_trading_experience_incomplete);

    return is_need_financial_assessment;
};

export default useNeedFinancialAssessment;
