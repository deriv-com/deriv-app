import { useEffect } from 'react';
import { useFetch, useInvalidateQuery } from '@deriv/api';
import { useStore } from '@deriv/stores';

const useIsHasP2PSupportedCurrencies = () => {
    const { client } = useStore();
    const { account_list, is_authorize, loginid } = client;
    const invalidate = useInvalidateQuery();
    const { data, ...rest } = useFetch('website_status', { options: { enabled: is_authorize } });

    // getting currency from the icon because account.currency is undefined
    const real_account_currencies_list = account_list
        .filter(account => !account.is_virtual)
        .map(account => account.icon);

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
