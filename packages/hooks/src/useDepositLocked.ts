import { useStore } from '@deriv/stores';
import useNeedAuthentication from './useNeedAuthentication';
import useNeedFinancialAssessment from './useNeedFinancialAssessment';
import useNeedTNC from './useNeedTNC';

const useDepositLocked = () => {
    const { client } = useStore();
    const { is_deposit_lock, is_trading_experience_incomplete, landing_company_shortcode } = client;
    const is_need_authentication = useNeedAuthentication();
    const is_need_tnc = useNeedTNC();
    const is_need_financial_assessment = useNeedFinancialAssessment();
    const is_malta_invest = landing_company_shortcode === 'maltainvest';
    const is_trading_experience_incomplete_or_need_financial_assessment = is_malta_invest
        ? is_trading_experience_incomplete
        : is_need_financial_assessment;

    const is_deposit_locked =
        is_deposit_lock ||
        is_need_authentication ||
        is_need_tnc ||
        is_trading_experience_incomplete_or_need_financial_assessment;

    return is_deposit_locked;
};

export default useDepositLocked;
