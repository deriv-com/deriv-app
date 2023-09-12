import { usePaginatedFetch, useSubscription } from '@deriv/api';
import { useEffect, useState } from 'react';

type TOrder = NonNullable<
    NonNullable<ReturnType<typeof useSubscription<'p2p_order_list'>>['data']>['p2p_order_list']
>['list'][number];

/** This custom hook returns the list of active orders by calling 'p2p_order_list' endpoint */
const useP2POrderList = (
    payload: NonNullable<Parameters<typeof usePaginatedFetch<'p2p_order_list'>>[1]>['payload']
) => {
    const { data, ...rest } = usePaginatedFetch('p2p_order_list', { payload });
    const { data: subscription_data, subscribe, ...subscription_rest } = useSubscription('p2p_order_list');
    const [newOrders, setNewOrders] = useState<TOrder[]>();

    useEffect(() => {
        subscribe();
    }, [subscribe]);
    useEffect(() => {
        setNewOrders(old_orderList => {
            const new_orderList = data?.p2p_order_list?.list as TOrder[] | undefined;

            if (!new_orderList) return old_orderList;
            if (!old_orderList) return new_orderList;
            const updated_orderList = [...old_orderList];
            new_orderList.forEach(new_order => {
                const index = updated_orderList.findIndex(old_order => old_order.id === new_order.id);

                if (index === -1) {
                    updated_orderList.push(new_order);
                } else {
                    updated_orderList[index] = new_order;
                }
            });

            return updated_orderList;
        });
    }, [data?.p2p_order_list?.list]);

    return {
        data: newOrders,
        ...rest,
        ...subscription_rest,
    };
};

export default useP2POrderList;
