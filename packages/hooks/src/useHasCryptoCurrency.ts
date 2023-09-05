import { useStore } from '@deriv/stores';

const useHasCryptoCurrency = () => {
    const { client } = useStore();
    const { account_list, is_crypto } = client;

    const has_crypto_currency = account_list.some(account => is_crypto(account.title || 'USD'));

    return has_crypto_currency;
};

export default useHasCryptoCurrency;
