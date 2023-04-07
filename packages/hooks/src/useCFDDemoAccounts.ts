import { useStore } from '@deriv/stores';

const useCFDAccounts = () => {
    const { client } = useStore();
    const { accounts, dxtrade_accounts_list, mt5_login_list } = client;

    let cfd_accounts: typeof mt5_login_list = [];
    if (Array.isArray(mt5_login_list)) {
        cfd_accounts = [...cfd_accounts, ...mt5_login_list];
    }
    if (Array.isArray(dxtrade_accounts_list)) {
        cfd_accounts = [...cfd_accounts, ...dxtrade_accounts_list];
    }

    return cfd_accounts;
};

export default useCFDAccounts;
