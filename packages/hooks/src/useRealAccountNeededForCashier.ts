import { useStore } from '@deriv/stores';
import useHasSvgAccount from './useHasSvgAccount';
import useHasMaltaInvestAccount from './useHasMaltaInvestAccount';

const useRealAccountNeededForCashier = () => {
    const { traders_hub } = useStore();
    const { is_eu_user, is_real } = traders_hub;

    const has_svg_account = useHasSvgAccount();
    const has_maltainvest_account = useHasMaltaInvestAccount();

    const no_real_mf_account = has_svg_account && is_eu_user;
    const no_real_cr_account = has_maltainvest_account && !is_eu_user;

    return (no_real_mf_account || no_real_cr_account) && is_real;
};

export default useRealAccountNeededForCashier;
