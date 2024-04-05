import React from 'react';
import { useLocation } from 'react-router-dom';
import { ORDERS_STATUS } from '@/constants';
import { useQueryString } from '@/hooks';
import { p2p } from '@deriv/api-v2';
import { Divider, useDevice } from '@deriv-com/ui';
import { OrderDetails } from '../OrderDetails';
import { OrdersTable } from './OrdersTable';
import { OrdersTableHeader } from './OrdersTableHeader';

const Orders = () => {
    const location = useLocation();
    const orderId = new URLSearchParams(location.search).get('order');
    const { queryString } = useQueryString();
    const { isMobile } = useDevice();
    const currentTab = queryString.tab ?? ORDERS_STATUS.ACTIVE_ORDERS;

    const {
        data = [],
        isFetching,
        isLoading,
        loadMoreOrders,
    } = p2p.order.useGetList({ active: currentTab === ORDERS_STATUS.ACTIVE_ORDERS ? 1 : 0 }, { enabled: !orderId });

    if (orderId) return <OrderDetails orderId={orderId} />;

    return (
        <>
            <OrdersTableHeader activeTab={currentTab} />
            {isMobile && <Divider />}
            <OrdersTable
                data={data}
                isActive={currentTab === ORDERS_STATUS.ACTIVE_ORDERS}
                isFetching={isFetching}
                isLoading={isLoading}
                loadMoreOrders={loadMoreOrders}
            />
        </>
    );
};
export default Orders;
