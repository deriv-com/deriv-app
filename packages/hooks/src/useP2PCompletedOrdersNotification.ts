import React from 'react';
import { useStore } from '@deriv/stores';
import { useGetAccountStatus } from '@deriv/api';
import useP2POrderList from './useP2POrderList';

const useP2PCompletedOrdersNotification = () => {
    const { subscribe, data, unsubscribe, isSubscribed } = useP2POrderList();
    const { data: getAccountStatusData } = useGetAccountStatus();
    const { is_p2p_user } = getAccountStatusData || {};
    const { client, notifications } = useStore();
    const { is_authorize } = client;

    React.useEffect(() => {
        if (is_authorize && is_p2p_user) {
            subscribe({
                payload: {
                    active: 0,
                },
            });
        }
        return () => {
            isSubscribed && unsubscribe();
        };
    }, [isSubscribed, is_authorize, is_p2p_user, subscribe, unsubscribe]);

    React.useEffect(() => {
        if (data?.p2p_order_list?.list.length && data?.p2p_order_list?.list !== notifications.p2p_completed_orders) {
            notifications.p2p_completed_orders = data.p2p_order_list.list;
        }
        // @ts-expect-error `p2p_order_list` return individual `p2p_order_info` if order info updated
        else if (data?.p2p_order_info) {
            if (notifications?.p2p_completed_orders) {
                // replace order if order id is in the list
                // @ts-expect-error `p2p_order_list` return individual `p2p_order_info` if order info updated
                if (notifications?.p2p_completed_orders.some(order => order.id === data.p2p_order_info.id)) {
                    const index = notifications?.p2p_completed_orders.findIndex(
                        // @ts-expect-error `p2p_order_list` return individual `p2p_order_info` if order info updated
                        order => order.id === data.p2p_order_info.id
                    );
                    // @ts-expect-error `p2p_order_list` return individual `p2p_order_info` if order info updated
                    notifications?.p2p_completed_orders.splice(index, 1, data.p2p_order_info);
                }
                // add order if order id is not in the list
                else {
                    // @ts-expect-error `p2p_order_list` return individual `p2p_order_info` if order info updated
                    notifications?.p2p_completed_orders.unshift(data.p2p_order_info);
                }
            }
        }
        notifications?.p2p_completed_orders?.sort((a, b) => {
            return (b.completion_time || 0) - (a.completion_time || 0);
        });
    }, [data, notifications]);
};

export default useP2PCompletedOrdersNotification;
