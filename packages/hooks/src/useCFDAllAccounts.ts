import { useStore } from '@deriv/stores';

/** @deprecated Use `useMT5AccountsList` for MT5 accounts and `useDxtradeAccountsList` for Other CFD accounts from `@deriv/api` instead. */
const useCFDAllAccounts = () => {
    const { client } = useStore();
    const { dxtrade_accounts_list, mt5_login_list, ctrader_accounts_list } = client;

    let cfd_accounts: typeof mt5_login_list = [];
    if (Array.isArray(mt5_login_list)) {
        cfd_accounts = [...cfd_accounts, ...mt5_login_list];
    }
    if (Array.isArray(dxtrade_accounts_list)) {
        cfd_accounts = [...cfd_accounts, ...dxtrade_accounts_list];
    }
    if (Array.isArray(ctrader_accounts_list)) {
        cfd_accounts = [...cfd_accounts, ...ctrader_accounts_list];
    }

    return cfd_accounts;
};

export default useCFDAllAccounts;
