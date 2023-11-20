import React from 'react';
import { usePaginatedFetch } from '@deriv/api';

/**
 * This custom hook returns available adverts for use with 'p2p_order_create' by calling 'p2p_advert_list' endpoint
 */
const useP2PAdvertList = (
    payload?: NonNullable<Parameters<typeof usePaginatedFetch<'p2p_advert_list'>>[1]>['payload']
) => {
    const { data, ...rest } = usePaginatedFetch('p2p_advert_list', { payload });

    // Add additional information to the 'p2p_advert_list' data
    const modified_data = React.useMemo(() => {
        const advert_list = data?.p2p_advert_list?.list;

        if (!advert_list) return undefined;

        return advert_list.map(advert => ({
            ...advert,
            /** Determine if the rate is floating or fixed */
            is_floating: advert.rate_type === 'float',
            /** The advert creation time in epoch. */
            created_time: new Date(advert.created_time),
        }));
    }, [data?.p2p_advert_list?.list]);

    return {
        /** The 'p2p_advert_list' response. */
        data: modified_data,
        ...rest,
    };
};

export default useP2PAdvertList;
