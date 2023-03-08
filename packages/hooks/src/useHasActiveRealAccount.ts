import { useStore } from '@deriv/stores';

const useHasActiveRealAccount = () => {
    const { client } = useStore();
    const { active_accounts } = client;

    const has_active_real_account = active_accounts.some(account => account.is_virtual === 0);

    return has_active_real_account;
};

export default useHasActiveRealAccount;
