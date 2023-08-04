import React from 'react';
import { useFetch } from '@deriv/api';

/**
 * we can use this hook to get the p2p_config which comes from the website_status!
 */
const useP2PConfig = () => {
    const { data, ...rest } = useFetch('website_status');

    const modified_p2p_config = React.useMemo(() => {
        const p2p_config = data?.website_status?.p2p_config;

        return {
            ...p2p_config,
            /** Indicates if the payment methods feature is enabled. */
            is_payment_methods_enabled: Boolean(p2p_config?.payment_methods_enabled),
        };
    }, [data?.website_status?.p2p_config]);

    return {
        modified_p2p_config,
        ...rest,
    };
};

export default useP2PConfig;
