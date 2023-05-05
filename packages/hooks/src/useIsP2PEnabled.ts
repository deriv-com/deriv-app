import { useEffect } from 'react';
import { useStore } from '@deriv/stores';
import { useFetch, useInvalidateQuery } from '@deriv/api';

const useIsP2PEnabled = () => {
    const { client, traders_hub } = useStore();
    const { is_authorize, loginid, currency, is_virtual } = client;
    const { is_low_risk_cr_eu_real } = traders_hub;
    const invalidate = useInvalidateQuery();
    const { data, ...rest } = useFetch('website_status', { options: { enabled: is_authorize } });

    const is_p2p_supported_currency = Boolean(
        data?.p2p_config?.supported_currencies.includes(currency.toLocaleLowerCase())
    );
    const is_p2p_enabled = is_p2p_supported_currency && !is_virtual && !is_low_risk_cr_eu_real;

    // Todo: should replace with the next line instead once BE is fixed.
    // const is_p2p_enabled = data?.p2p_config?.disabled === 0;

    useEffect(() => {
        invalidate('website_status');
    }, [invalidate, loginid]);

    return {
        ...rest,
        data: is_p2p_enabled,
    };
};

export default useIsP2PEnabled;
