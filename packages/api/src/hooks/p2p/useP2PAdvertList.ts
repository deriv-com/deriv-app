import React from 'react';
import useInfiniteQuery from '../../useInfiniteQuery';
import useAuthorize from '../useAuthorize';

/**
 * This custom hook returns available adverts for use with 'p2p_order_create' by calling 'p2p_advert_list' endpoint
 */
const useP2PAdvertList = (
    payload?: NonNullable<Parameters<typeof useInfiniteQuery<'p2p_advert_list'>>[1]>['payload'],
    config?: NonNullable<Parameters<typeof useInfiniteQuery<'p2p_advert_list'>>[1]>['options']
) => {
    const { isSuccess } = useAuthorize();
    const { data, fetchNextPage, ...rest } = useInfiniteQuery('p2p_advert_list', {
        payload: { ...payload, offset: payload?.offset || 0, limit: payload?.limit || 50 },
        options: {
            getNextPageParam: (lastPage, pages) => {
                if (!lastPage?.p2p_advert_list?.list) return;

                return pages.length;
            },
            enabled: isSuccess && (config?.enabled === undefined || config.enabled),
        },
    });

    // Flatten the data array.
    const flatten_data = React.useMemo(() => {
        if (!data?.pages?.length) return;

        return data?.pages?.flatMap(page => page?.p2p_advert_list?.list);
    }, [data?.pages]);

    // Add additional information to the 'p2p_advert_list' data
    const modified_data = React.useMemo(() => {
        if (!flatten_data?.length) return undefined;

        return flatten_data.map(advert => ({
            ...advert,
            /** Determine if the rate is floating or fixed */
            is_floating: advert?.rate_type === 'float',
            /** The activation status of the advert. */
            is_active: Boolean(advert?.is_active),
            /** Indicates that this advert will appear on the main advert list. */
            is_visible: Boolean(advert?.is_visible),
            advertiser_details: {
                ...advert?.advertiser_details,
                /** Indicates that the advertiser is blocked by the current user. */
                is_blocked: Boolean(advert?.advertiser_details.is_blocked),
                /** Indicates that the advertiser is a favourite. */
                is_favourite: Boolean(advert?.advertiser_details.is_favourite),
                /** Indicates if the advertiser is currently online. */
                is_online: Boolean(advert?.advertiser_details?.is_online),
                /** Indicates that the advertiser was recommended in the most recent review by the current user. */
                is_recommended: Boolean(advert?.advertiser_details?.is_recommended),
            },
            /** The advert creation time in epoch. */
            created_time: advert?.created_time ? new Date(advert.created_time) : undefined,
        }));
    }, [flatten_data]);

    return {
        /** The 'p2p_advert_list' response. */
        data: modified_data,
        loadMoreAdverts: fetchNextPage,
        ...rest,
    };
};

export default useP2PAdvertList;
