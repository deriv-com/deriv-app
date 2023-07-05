import { useStore } from '@deriv/stores';

/**
 * we can use this hook to get all real accounts for both Eu and Non-Eu regions.
 * it loops through the accounts list and returns all real accounts
 */

const usePlatformRealAccounts = () => {
    const { client, traders_hub } = useStore();
    const { accounts } = client;
    const { is_eu_user } = traders_hub;
    const account_list = Object.keys(accounts).map(loginid => ({
        ...accounts[loginid],
        loginid,
    }));

    const platform_real_accounts = account_list.filter(account => {
        const is_maltainvest =
            'landing_company_shortcode' in account && account.landing_company_shortcode === 'maltainvest';

        if (account.is_virtual) return false;
        if (!is_eu_user) return !is_maltainvest;

        return is_maltainvest;
    });

    return platform_real_accounts;
};

export default usePlatformRealAccounts;
