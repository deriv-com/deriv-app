import React from 'react';
import { useFetch, useInvalidateQuery } from '@deriv/api';
import { useStore } from '@deriv/stores';

/**
 * A custom hook to get the p2p_config information from `website_status` endpoint
 */
const useP2PConfig = () => {
    const { client } = useStore();
    const { is_authorize, loginid } = client;
    const { data, ...rest } = useFetch('website_status', { options: { enabled: is_authorize } });
    const invalidate = useInvalidateQuery();

    // Add additional information to the p2p config data.
    const modified_p2p_config = React.useMemo(() => {
        const p2p_config = data?.website_status?.p2p_config;

        if (!p2p_config) return undefined;
        return {
            ...p2p_config,
            /** Indicates if the payment methods feature is enabled. */
            is_payment_methods_enabled: Boolean(p2p_config?.payment_methods_enabled),
        };
    }, [data?.website_status?.p2p_config]);

    React.useEffect(() => {
        invalidate('website_status');
    }, [invalidate, loginid]);

    return {
        /** The p2p config response. */
        data: modified_p2p_config,
        ...rest,
    };
};

export default useP2PConfig;
