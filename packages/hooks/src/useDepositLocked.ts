import { useStore } from '@deriv/stores';
import useNeedAuthentication from './useNeedAuthentication';
import useNeedFinancialAssessment from './useNeedFinancialAssessment';
import useNeedTNC from './useNeedTNC';

const useDepositLocked = () => {
    const { client } = useStore();
    const { is_deposit_lock } = client;
    const is_need_authentication = useNeedAuthentication();
    const is_need_tnc = useNeedTNC();
    const is_need_financial_assessment = useNeedFinancialAssessment();
    const is_deposit_locked = is_deposit_lock || is_need_authentication || is_need_tnc || is_need_financial_assessment;

    return is_deposit_locked;
};

export default useDepositLocked;
