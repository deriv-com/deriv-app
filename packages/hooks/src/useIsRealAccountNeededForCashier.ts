import { useStore } from '@deriv/stores';
import useHasMaltaInvestAccount from './useHasMaltaInvestAccount';
import useHasSvgAccount from './useHasSvgAccount';

const useIsRealAccountNeededForCashier = () => {
    const { traders_hub } = useStore();
    const { is_eu_user, is_real } = traders_hub;

    const has_svg_account = useHasSvgAccount();
    const has_maltainvest_account = useHasMaltaInvestAccount();

    const no_real_mf_account = has_svg_account && !has_maltainvest_account && is_eu_user;

    const no_real_cr_account = !has_svg_account && has_maltainvest_account && !is_eu_user;

    const is_real_account_needed = no_real_mf_account || no_real_cr_account;

    const is_real_account_needed_for_cashier = is_real_account_needed && is_real;

    return is_real_account_needed_for_cashier;
};

export default useIsRealAccountNeededForCashier;
