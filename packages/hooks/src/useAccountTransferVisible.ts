import { useStore } from '@deriv/stores';
import useHasMaltaInvestAccount from './useHasMaltaInvestAccount';

const useAccountTransferVisible = () => {
    const { client } = useStore();
    const { landing_company_shortcode, residence } = client;
    const has_malta_invest_account = useHasMaltaInvestAccount();
    const is_account_transfer_visible =
        residence !== 'im' && (landing_company_shortcode !== 'malta' || has_malta_invest_account);

    return is_account_transfer_visible;
};

export default useAccountTransferVisible;
