import { useStore } from '@deriv/stores';

const useHasUSDCurrency = () => {
    const { client } = useStore();
    const { account_list } = client;

    const has_usd_currency = account_list.some(account => account.title === 'USD');

    return has_usd_currency;
};

export default useHasUSDCurrency;
