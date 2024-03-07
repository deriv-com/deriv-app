import React from 'react';
import useInfiniteQuery from '../../../../../useInfiniteQuery';
import useAuthorize from '../../../../useAuthorize';

/**
 * This custom hook returns the available advertisers who have had or currently have trades with the current advertiser.
 */
const useAdvertiserList = (
    payload?: NonNullable<Parameters<typeof useInfiniteQuery<'p2p_advertiser_list'>>[1]>['payload']
) => {
    const { isSuccess } = useAuthorize();
    if (!payload?.is_blocked) {
        delete payload?.is_blocked;
    }
    if (!payload?.advertiser_name) {
        delete payload?.advertiser_name;
    }
    const { data, fetchNextPage, ...rest } = useInfiniteQuery('p2p_advertiser_list', {
        payload: { ...payload, offset: payload?.offset, limit: payload?.limit },
        options: {
            getNextPageParam: (lastPage, pages) => {
                if (!lastPage?.p2p_advertiser_list?.list?.length) return;

                return pages.length;
            },
            enabled: isSuccess,
            refetchOnWindowFocus: false,
        },
    });

    // Flatten the data array.
    const flatten_data = React.useMemo(() => {
        if (!data?.pages?.length) return;

        return data?.pages?.flatMap(page => page?.p2p_advertiser_list?.list);
    }, [data?.pages]);

    // Add additional information to the 'p2p_advertiser_list' data
    const modified_data = React.useMemo(() => {
        if (!flatten_data?.length) return undefined;

        return flatten_data.map(advertiser => ({
            ...advertiser,
            /** Indicating whether the advertiser's identity has been verified. */
            is_basic_verified: Boolean(advertiser?.basic_verification),
            /** Indicating whether the advertiser's address has been verified. */
            is_fully_verified: Boolean(advertiser?.full_verification),
            /** The approval status of the advertiser. */
            is_approved: Boolean(advertiser?.is_approved),
            /** Indicates that the advertiser is blocked. */
            is_blocked: Boolean(advertiser?.is_blocked),
            /** Indicates that the advertiser is a favourite. */
            is_favourite: Boolean(advertiser?.is_favourite),
            /** Indicates if the advertiser's active adverts are listed. When false, adverts won't be listed regardless if they are active or not. */
            is_listed: Boolean(advertiser?.is_listed),
            /** Indicates if the advertiser is currently online. */
            is_online: Boolean(advertiser?.is_online),
            /** Indicates that the advertiser was recommended in the most recent review by the current user. */
            is_recommended: Boolean(advertiser?.is_recommended),
        }));
    }, [flatten_data]);

    return {
        /** P2P advertiser list */
        data: modified_data,
        loadMoreAdvertisers: fetchNextPage,
        ...rest,
    };
};

export default useAdvertiserList;
