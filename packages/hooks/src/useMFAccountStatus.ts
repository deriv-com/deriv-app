import { MT5_ACCOUNT_STATUS } from '@deriv/shared';
import useHasMaltaInvestAccount from './useHasMaltaInvestAccount';
import useGetMFAccountStatus from './useGetMFAccountStatus';
import { useStore } from '@deriv/stores';

const useMFAccountStatus = () => {
    const {
        client: { is_eu },
    } = useStore();
    const has_malta_invest_account = useHasMaltaInvestAccount();
    const mf_status = useGetMFAccountStatus();

    const should_show_status_for_multipliers_account =
        is_eu &&
        has_malta_invest_account &&
        mf_status &&
        [MT5_ACCOUNT_STATUS.PENDING, MT5_ACCOUNT_STATUS.FAILED, MT5_ACCOUNT_STATUS.NEEDS_VERIFICATION].includes(
            mf_status
        );
    return should_show_status_for_multipliers_account ? mf_status : null;
};

export default useMFAccountStatus;
