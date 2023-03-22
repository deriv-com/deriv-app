import { useStore } from '@deriv/stores';
import { Jurisdiction } from '@deriv/shared';

const useHasMaltaInvestAccount = () => {
    const { client } = useStore();
    const { active_accounts } = client;
    const has_malta_invest_account = active_accounts.some(
        account => account.landing_company_shortcode === Jurisdiction.MALTA_INVEST
    );

    return has_malta_invest_account;
};

export default useHasMaltaInvestAccount;
