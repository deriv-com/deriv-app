import React from 'react';
import { useFetch } from '@deriv/api';
import useExchangeRate from './useExchangeRate';

/**
 * This custom hook returns available adverts for use with 'p2p_order_create' by calling 'p2p_advert_list' endpoint
 */
const useP2PAdvertList = (payload?: NonNullable<Parameters<typeof useFetch<'p2p_advert_list'>>[1]>['payload']) => {
    const { getRate } = useExchangeRate();

    const limit: number = payload?.limit || 50;
    const [offset, setOffset] = React.useState<number>(payload?.offset || 0);

    const { data, ...rest } = useFetch('p2p_advert_list', {
        payload: { ...payload, offset, limit },
        options: { keepPreviousData: true },
    });

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

    const loadMoreAdverts = React.useCallback((startIndex: number) => {
        setOffset(startIndex);
    }, []);

    const [combined_data, setCombinedData] = React.useState(modified_data);
    const [, setPreviousData] = React.useState<typeof modified_data>([]);

    React.useEffect(() => {
        setPreviousData([]);
        setOffset(0);
    }, [
        payload?.advertiser_id,
        payload?.counterparty_type,
        payload?.payment_method,
        payload?.use_client_limits,
        payload?.local_currency,
        payload?.sort_by,
    ]);

    React.useEffect(() => {
        // This preserves the previous data when loadMoreAdverts is called.
        setPreviousData(prev_data => {
            const old_adverts = [...(prev_data || [])];
            const new_items: typeof modified_data = [];
            modified_data?.forEach(new_item => {
                const old_item_idx = old_adverts.findIndex(old_item => old_item.id === new_item.id);
                if (old_item_idx > -1) {
                    old_adverts[old_item_idx] = new_item;
                } else {
                    new_items.push(new_item);
                }
            });
            setCombinedData([...old_adverts, ...new_items]);
            return [...old_adverts, ...new_items];
        });
    }, [modified_data]);

    return {
        /** The 'p2p_advert_list' response. */
        data: combined_data,
        loadMoreAdverts,
        ...rest,
    };
};

export default useP2PAdvertList;
