import React from 'react';
import { useStore } from '@deriv/stores';
import useIsP2PEnabled from './useIsP2PEnabled';
import useP2POrderList from './useP2POrderList';

const useP2PCompletedOrdersNotification = () => {
    const { data: is_p2p_enabled } = useIsP2PEnabled();
    const { subscribe, data, unsubscribe } = useP2POrderList();
    const { client, notifications } = useStore();
    const { is_authorize } = client;

    React.useEffect(() => {
        if (is_authorize && is_p2p_enabled) {
            subscribe({
                payload: {
                    active: 0,
                },
            });
        } else {
            unsubscribe();
        }
    }, [is_authorize, is_p2p_enabled, subscribe, unsubscribe]);

    React.useEffect(() => {
        // @ts-expect-error `p2p_order_list` return individual `p2p_order_info` if order info updated
        if (data?.p2p_order_info) {
            // create new list if it doesn't exist
            if (!notifications?.p2p_completed_orders) {
                // @ts-expect-error `p2p_order_list` return individual `p2p_order_info` if order info updated
                notifications.p2p_completed_orders = [data.p2p_order_info];
                return;
            }
            // insert new order to the top of the list if it's not already there
            // @ts-expect-error `p2p_order_list` return individual `p2p_order_info` if order info updated
            if (!notifications?.p2p_completed_orders.includes(data.p2p_order_info)) {
                // @ts-expect-error `p2p_order_list` return individual `p2p_order_info` if order info updated
                notifications?.p2p_completed_orders.unshift(data.p2p_order_info);
            }
            // update order if it's already in the list
            else {
                const index = notifications?.p2p_completed_orders.findIndex(
                    // @ts-expect-error `p2p_order_list` return individual `p2p_order_info` if order info updated
                    order => order.id === data.p2p_order_info.id
                );
                // @ts-expect-error `p2p_order_list` return individual `p2p_order_info` if order info updated
                notifications?.p2p_completed_orders.splice(index, 1, data.p2p_order_info);
            }
        }
        if (data?.p2p_order_list?.list.length && data?.p2p_order_list?.list !== notifications.p2p_completed_orders) {
            notifications.p2p_completed_orders = data.p2p_order_list.list;
        }
        notifications?.p2p_completed_orders?.sort((a, b) => {
            return (b.completion_time || 0) - (a.completion_time || 0);
        });
    }, [data, notifications]);
};

export default useP2PCompletedOrdersNotification;
