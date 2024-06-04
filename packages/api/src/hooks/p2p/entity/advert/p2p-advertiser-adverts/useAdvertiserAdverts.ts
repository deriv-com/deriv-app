import { useMemo } from 'react';
import useInfiniteQuery from '../../../../../useInfiniteQuery';
import useAuthorize from '../../../../useAuthorize';

/** This custom hook returns a list of adverts under the current active client. */
const useAdvertiserAdverts = (
    payload?: NonNullable<Parameters<typeof useInfiniteQuery<'p2p_advertiser_adverts'>>[1]>['payload'],
    config?: NonNullable<Parameters<typeof useInfiniteQuery<'p2p_advertiser_adverts'>>[1]>['options']
) => {
    const { isSuccess } = useAuthorize();
    const { data, fetchNextPage, ...rest } = useInfiniteQuery('p2p_advertiser_adverts', {
        payload: { ...payload, offset: payload?.offset, limit: payload?.limit },
        options: {
            ...config,
            getNextPageParam: (lastPage, pages) => {
                if (!lastPage?.p2p_advertiser_adverts?.list?.length) return;

                return pages.length;
            },
            enabled: isSuccess && (config?.enabled === undefined || config.enabled),
        },
    });

    const flatten_data = useMemo(() => {
        if (!data?.pages?.length) return;

        return data?.pages?.flatMap(page => page?.p2p_advertiser_adverts?.list);
    }, [data?.pages]);

    const modified_data = useMemo(() => {
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
                /** Indicates that the advertiser has not been recommended yet. */
                has_not_been_recommended: advert?.advertiser_details.is_recommended === null,
            },
            /** The advert creation time in epoch. */
            created_time: advert?.created_time ? new Date(advert.created_time) : undefined,
            /** Indicates if this is block trade advert or not. */
            block_trade: Boolean(advert?.block_trade),
        }));
    }, [flatten_data]);

    return {
        /** The 'p2p_advertiser_adverts' response. */
        data: modified_data,
        /** Function to fetch the next batch of adverts */
        loadMoreAdverts: fetchNextPage,
        ...rest,
    };
};

export default useAdvertiserAdverts;
