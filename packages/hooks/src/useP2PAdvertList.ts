import React, { useEffect, useState, useRef } from 'react';
import { usePaginatedFetch, useInvalidateQuery } from '@deriv/api';
import useExchangeRate from './useExchangeRate';

/**
 * This custom hook returns available adverts for use with 'p2p_order_create' by calling 'p2p_advert_list' endpoint
 */
const useP2PAdvertList = (
    payload?: NonNullable<Parameters<typeof usePaginatedFetch<'p2p_advert_list'>>[1]>['payload']
) => {
    const invalidate = useInvalidateQuery();
    const { getRate } = useExchangeRate();
    const { data, ...rest } = usePaginatedFetch('p2p_advert_list', { payload });

    // Add additional information to the 'p2p_advert_list' data
    const modified_data = React.useMemo(() => {
        const advert_list = data?.p2p_advert_list?.list;

        if (!advert_list) return undefined;

        return advert_list.map(advert => ({
            ...advert,
            /** Conversion rate from account currency to local currency, using current market rate if applicable. */
            effective_rate: getRate(advert.local_currency || ''),
            /** Determine if the rate is floating or fixed */
            is_floating: advert.rate_type === 'float',
            /** The advert creation time in epoch. */
            created_time: new Date(advert.created_time),
        }));
    }, [data?.p2p_advert_list?.list, getRate]);

    const [combined_data, setCombinedData] = useState(modified_data);
    const previous_data_ref = useRef<typeof modified_data>([]);

    useEffect(() => {
        previous_data_ref.current = [];
        invalidate('p2p_advert_list');
    }, [
        payload?.advertiser_id,
        payload?.counterparty_type,
        payload?.payment_method,
        payload?.use_client_limits,
        payload?.local_currency,
        payload?.sort_by,
        invalidate,
    ]);

    useEffect(() => {
        // This preserves the previous data when loadMore is called.
        if (Array.isArray(previous_data_ref.current) && Array.isArray(modified_data)) {
            const old_adverts = [...previous_data_ref.current];
            const new_items: typeof modified_data = [];
            modified_data?.forEach(new_item => {
                const old_item_idx = old_adverts.findIndex(old_item => old_item.id === new_item.id);
                if (old_item_idx > -1) {
                    old_adverts[old_item_idx] = new_item;
                } else {
                    new_items.push(new_item);
                }
            });
            previous_data_ref.current = [...old_adverts, ...new_items];
            setCombinedData([...old_adverts, ...new_items]);
        }
    }, [modified_data]);

    return {
        /** The 'p2p_advert_list' response. */
        data: combined_data,
        ...rest,
    };
};

export default useP2PAdvertList;
