import { useStore } from '@deriv/stores';
import useCurrencyConfig from './useCurrencyConfig';

const useHasFiatCurrency = () => {
    const { client } = useStore();
    const { account_list } = client;
    const { getConfig } = useCurrencyConfig();

    const has_fiat_currency = account_list.some(
        account => account.title !== 'Real' && getConfig(account.title || '')?.is_fiat
    );

    return has_fiat_currency;
};

export default useHasFiatCurrency;
