import { useEffect } from 'react';
import { useFetch, useInvalidateQuery } from '@deriv/api';
import { useStore } from '@deriv/stores';
import useHasP2PSupportedCurrencies from './useHasP2PSupportedCurrencies';

const useIsP2PEnabled = () => {
    const { client, traders_hub } = useStore();
    // Todo: to replace it with useAuthorize hook
    const { is_authorize, loginid, currency, is_virtual } = client;
    const { is_low_risk_cr_eu_real } = traders_hub;
    const invalidate = useInvalidateQuery();
    // Todo: Replace it with new BE p2p_settings endpoint when its ready
    const { data, ...rest } = useFetch('website_status', { options: { enabled: is_authorize } });

    const is_p2p_supported_currency = Boolean(
        data?.website_status?.p2p_config?.supported_currencies.includes(currency.toLocaleLowerCase())
    );
    const is_p2p_enabled = is_p2p_supported_currency && !is_virtual && !is_low_risk_cr_eu_real;

    useEffect(() => {
        invalidate('website_status');
    }, [invalidate, loginid]);

    return {
        ...rest,
        data: is_p2p_enabled,
    };
};

export default useIsP2PEnabled;
