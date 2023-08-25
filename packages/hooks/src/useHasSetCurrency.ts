import { useStore } from '@deriv/stores';
import useHasActiveRealAccount from './useHasActiveRealAccount';

const useHasSetCurrency = () => {
    const { client } = useStore();
    const { account_list } = client;
    const has_active_real_account = useHasActiveRealAccount();

    const has_real_account = account_list
        .filter(account => !account.is_virtual)
        .some(account => account.title !== 'Real' && account.title !== 'Investment');

    const has_set_currency = has_real_account || !has_active_real_account;

    return has_set_currency;
};

export default useHasSetCurrency;
