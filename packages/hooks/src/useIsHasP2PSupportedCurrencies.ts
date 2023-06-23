import { useEffect } from 'react';
import { useFetch, useInvalidateQuery } from '@deriv/api';
import { useStore } from '@deriv/stores';

const useIsHasP2PSupportedCurrencies = () => {
    const { client } = useStore();
    const { active_accounts, is_authorize, loginid } = client;
    const invalidate = useInvalidateQuery();
    const { data, ...rest } = useFetch('website_status', { options: { enabled: is_authorize } });

    const real_account_currencies_list = active_accounts
        .filter(account => !account.is_virtual)
        .map(account => account.currency?.toLowerCase());

    const is_has_p2p_supported_currencies = Boolean(
        data?.website_status?.p2p_config?.supported_currencies.some((currency: string) =>
            real_account_currencies_list.includes(currency)
        )
    );

    useEffect(() => {
        invalidate('website_status');
    }, [invalidate, loginid]);

    return {
        ...rest,
        data: is_has_p2p_supported_currencies,
    };
};

export default useIsHasP2PSupportedCurrencies;
