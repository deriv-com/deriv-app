import { useStore } from '@deriv/stores';
import useCFDAccounts from './useCFDAccounts';

const useCFDRealAccounts = () => {
    const { traders_hub } = useStore();
    const { is_eu_user } = traders_hub;
    const accounts = useCFDAccounts();

    const cfd_real_accounts = accounts.filter(account => {
        const is_demo = account.account_type === 'demo';
        const is_maltainvest = account.landing_company_short === 'maltainvest';

        if (is_demo) return false;
        if (!is_eu_user) return !is_maltainvest;

        return is_maltainvest;
    });

    return cfd_real_accounts;
};

export default useCFDRealAccounts;
