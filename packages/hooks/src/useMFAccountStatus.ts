import { AccountStatus } from '@deriv/shared';
import useContentFlag from './useContentFlag';
import useHasMaltaInvestAccount from './useHasMaltaInvestAccount';
import useGetMFAccountStatus from './useGetMFAccountStatus';

const useMFAccountStatus = () => {
    const { is_low_risk_cr_eu, is_eu_real } = useContentFlag();
    const has_malta_invest_account = useHasMaltaInvestAccount();
    const mf_status = useGetMFAccountStatus();

    const should_show_status_for_multipliers_account =
        (is_low_risk_cr_eu || is_eu_real) &&
        has_malta_invest_account &&
        mf_status &&
        [AccountStatus.PENDING, AccountStatus.FAILED, AccountStatus.NEEDS_VERIFICATION].includes(mf_status);
    return should_show_status_for_multipliers_account ? mf_status : null;
};

export default useMFAccountStatus;
