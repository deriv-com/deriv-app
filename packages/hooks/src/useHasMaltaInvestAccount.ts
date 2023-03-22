import { useStore } from '@deriv/stores';

const useHasMaltaInvestAccount = () => {
    const { client } = useStore();
    const { active_accounts } = client;
    const has_malta_invest_account = active_accounts.some(
        account => account.landing_company_shortcode === 'maltainvest'
    );

    return has_malta_invest_account;
};

export default useHasMaltaInvestAccount;
