import React from 'react';
import { useInfiniteQuery } from '@deriv/api';
import useExchangeRate from './useExchangeRate';

/**
 * This custom hook returns available adverts for use with 'p2p_order_create' by calling 'p2p_advert_list' endpoint
 */
const useP2PAdvertList = (
    payload?: NonNullable<Parameters<typeof useInfiniteQuery<'p2p_advert_list'>>[1]>['payload'],
    config?: { enabled?: boolean }
) => {
    const { data, fetchNextPage, ...rest } = useInfiniteQuery('p2p_advert_list', {
        payload: { ...payload, offset: payload?.offset || 0, limit: payload?.limit || 50 },
        options: {
            getNextPageParam: (lastPage, pages) => {
                if (!lastPage?.p2p_advert_list?.list) return;

                return pages.length;
            },
            enabled: config?.enabled === undefined || config.enabled,
        },
    });

    // Flatten the data array.
    const flatten_data = React.useMemo(() => {
        if (!data?.pages?.length) return;

        return data?.pages?.flatMap(page => page?.p2p_advert_list?.list);
    }, [data?.pages]);
    const { getRate } = useExchangeRate();

    // Add additional information to the 'p2p_advert_list' data
    const modified_data = React.useMemo(() => {
        if (!flatten_data?.length) return undefined;

        return flatten_data.map(advert => ({
            ...advert,
            /** Conversion rate from account currency to local currency, using current market rate if applicable. */
            effective_rate: getRate(advert?.local_currency || ''),
            /** Determine if the rate is floating or fixed */
            is_floating: advert?.rate_type === 'float',
            /** The advert creation time in epoch. */
            created_time: advert?.created_time ? new Date(advert.created_time) : undefined,
        }));
    }, [flatten_data, getRate]);

    return {
        /** The 'p2p_advert_list' response. */
        data: modified_data,
        loadMoreAdverts: fetchNextPage,
        ...rest,
    };
};

export default useP2PAdvertList;
