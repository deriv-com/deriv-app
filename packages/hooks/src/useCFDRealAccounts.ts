import { useStore } from '@deriv/stores';
import useCFDAccounts from './useCFDAccounts';

/**
 * we can use this hook to get the real CFD accounts for both Eu and Non-Eu regions.
 * it loops through the all of user's CFD accounts, finds and returns real accounts
 * @example
 * const cfd_real_accounts = useCFDRealAccounts();
 * @returns [{ balance: 100, currency: 'USD' }, { balance: 50, currency: 'EUR' }]
 */
const useCFDRealAccounts = () => {
    const { traders_hub } = useStore();
    const { is_eu_user } = traders_hub;
    const cfd_accounts = useCFDAccounts();

    const cfd_real_accounts = cfd_accounts.filter(account => {
        const is_demo = account.account_type === 'demo';
        const is_maltainvest = account.landing_company_short === 'maltainvest';

        if (is_demo) return false;
        if (!is_eu_user) return !is_maltainvest;

        return is_maltainvest;
    });

    return cfd_real_accounts;
};

export default useCFDRealAccounts;
