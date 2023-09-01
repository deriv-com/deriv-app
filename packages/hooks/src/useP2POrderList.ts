import { usePaginatedFetch, useSubscription } from '@deriv/api';
import { useEffect, useMemo } from 'react';

/** A custom hook to get the list of p2p order list. */
const useP2POrderList = (
    payload: NonNullable<Parameters<typeof usePaginatedFetch<'p2p_order_list'>>[1]>['payload']
) => {
    const { data, ...rest } = usePaginatedFetch('p2p_order_list', { payload });
    const { data: subscription_data, subscribe, ...subscription_rest } = useSubscription('p2p_order_list');

    useEffect(() => {
        subscribe();
    }, [subscribe]);

    // The list of orders is stored in the data property of the response.
    const orders = useMemo(() => data?.p2p_order_list?.list, [data]);

    // The updated order is stored in the data property of the response.
    const updated_order = useMemo(() => subscription_data?.p2p_order_list?.list[0], [subscription_data]);

    // If the updated order is in the list of orders, replace it with the updated order.
    const updated_orders = useMemo(
        () => orders?.map((order: { id: any }) => (order.id === updated_order?.id ? updated_order : order)),
        [orders, updated_order]
    );

    return {
        data: updated_orders,
        ...rest,
        ...subscription_rest,
    };
};

export default useP2POrderList;
