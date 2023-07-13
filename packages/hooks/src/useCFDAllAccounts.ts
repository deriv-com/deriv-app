import { useStore } from '@deriv/stores';

/**
 * we can use this hook to get the CFD accounts for both Eu and Non-Eu regions.
 * it gets dxtrade_accounts_list and mt5_login_list from store and merges them into one array
 * and returns the array
 */
const useCFDAllAccounts = () => {
    const { client } = useStore();
    const { dxtrade_accounts_list, mt5_login_list, derivez_accounts_list } = client;

    let cfd_accounts: typeof mt5_login_list = [];
    if (Array.isArray(mt5_login_list)) {
        cfd_accounts = [...cfd_accounts, ...mt5_login_list];
    }
    if (Array.isArray(dxtrade_accounts_list)) {
        cfd_accounts = [...cfd_accounts, ...dxtrade_accounts_list];
    }
    if (Array.isArray(derivez_accounts_list)) {
        cfd_accounts = [...cfd_accounts, ...derivez_accounts_list];
    }

    return cfd_accounts;
};

export default useCFDAllAccounts;
