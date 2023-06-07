import { useStore } from '@deriv/stores';

const useHasFiatCurrency = () => {
    const { client } = useStore();
    const { account_list, is_crypto } = client;

    const has_fiat_currency = account_list.some(account => account.title !== 'Real' && !is_crypto(account.title));

    return has_fiat_currency;
};

export default useHasFiatCurrency;
