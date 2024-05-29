import { useStore } from '@deriv/stores';
import useP2PSettings from './useP2PSettings';

const useHasP2PSupportedCurrencies = () => {
    const { client } = useStore();
    const { active_accounts } = client;
    const { p2p_settings, ...rest } = useP2PSettings();

    const real_account_currencies_list = active_accounts
        .filter(account => !account.is_virtual)
        .map(account => account.currency?.toLowerCase());

    const has_p2p_supported_currencies = Boolean(
        p2p_settings?.supported_currencies?.some((currency: string) => real_account_currencies_list.includes(currency))
    );

    return {
        ...rest,
        data: has_p2p_supported_currencies,
    };
};

export default useHasP2PSupportedCurrencies;
