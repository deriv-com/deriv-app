import React from 'react';
import useSubscription from '../../../../../useSubscription';
import useInfiniteQuery from '../../../../../useInfiniteQuery';
import useAuthorize from '../../../../useAuthorize';

/** This custom hook returns a list of orders under the current client. */
const useOrderList = (
    payload?: NonNullable<Parameters<typeof useInfiniteQuery<'p2p_order_list'>>[1]>['payload'],
    config?: NonNullable<Parameters<typeof useInfiniteQuery<'p2p_order_list'>>[1]>['options']
) => {
    const { isSuccess } = useAuthorize();
    const { data: subscriptionData, subscribe, unsubscribe } = useSubscription('p2p_order_list');

    // Subscribe to the p2p_order_list endpoint to keep track of the order list updates
    React.useEffect(() => {
        if (isSuccess) subscribe();

        return () => {
            unsubscribe();
        };
    }, [isSuccess]);

    // Fetch the order list data which handles pagination
    const {
        data: queryData,
        fetchNextPage,
        refetch,
        ...rest
    } = useInfiniteQuery('p2p_order_list', {
        payload: { ...payload, offset: payload?.offset, limit: payload?.limit },
        options: {
            getNextPageParam: (lastPage, pages) => {
                if (lastPage?.p2p_order_list?.list?.length === 0) return;
                return pages.length;
            },
            enabled: subscriptionData && (config?.enabled === undefined || config.enabled),
        },
    });

    // Refetch the data when the subscription data changes
    React.useEffect(() => {
        if (subscriptionData) {
            refetch();
        }
    }, [subscriptionData, refetch]);

    // Flatten the data array
    const flattened_data = React.useMemo(() => {
        if (!queryData?.pages?.length) return;

        return queryData?.pages?.flatMap(page => page?.p2p_order_list?.list);
    }, [queryData?.pages]);

    // Additional p2p_order_list data
    const modified_data = React.useMemo(() => {
        if (!flattened_data) return undefined;

        return flattened_data.map(advert => ({
            ...advert,
            /** Details of the advert for this order. */
            advert_details: {
                ...advert?.advert_details,
                /** Indicates if this is block trade advert or not. */
                is_block_trade: Boolean(advert?.advert_details?.block_trade),
            },
            /** Details of the advertiser for this order. */
            advertiser_details: {
                ...advert?.advertiser_details,
                /** Indicates if the advertiser is currently online. */
                is_online: Boolean(advert?.advertiser_details?.is_online),
                /** Indicates that the advertiser was recommended in the most recent review by the current user. */
                is_recommended: Boolean(advert?.advertiser_details?.is_recommended),
                /** Indicates that the advertiser has not been recommended yet. */
                has_not_been_recommended: advert?.advertiser_details?.is_recommended === null,
            },
            /** Details of the client who created the order. */
            client_details: {
                ...advert?.client_details,
                /** Indicates if the advertiser is currently online. */
                is_online: Boolean(advert?.client_details?.is_online),
                /** Indicates that the advertiser was recommended in the most recent review by the current user. */
                is_recommended: Boolean(advert?.client_details?.is_recommended),
                /** Indicates that the advertiser has not been recommended yet. */
                has_not_been_recommended: advert?.client_details?.is_recommended === null,
            },
            is_incoming: Boolean(advert?.is_incoming),
            /** Indicates if a review can be given. */
            is_reviewable: Boolean(advert?.is_reviewable),
            /** Indicates if the latest order changes have been seen by the current client. */
            is_seen: Boolean(advert?.is_seen),
            /** Details of the review you gave for this order, if any. */
            review_details: {
                ...advert?.review_details,
                /** Indicates if the advertiser is recommended. */
                is_recommended: Boolean(advert?.review_details?.recommended),
                /** Indicates that the advertiser has not been recommended yet. */
                has_not_been_recommended: advert?.review_details?.recommended === null,
            },
            /** Indicates that the seller in the process of confirming the order. */
            is_verification_pending: Boolean(advert?.verification_pending),
        }));
    }, [flattened_data]);

    return {
        /** The 'p2p_order_list' response. */
        data: modified_data,
        /** Fetch the next page of orders. */
        loadMoreOrders: fetchNextPage,
        ...rest,
    };
};

export default useOrderList;
