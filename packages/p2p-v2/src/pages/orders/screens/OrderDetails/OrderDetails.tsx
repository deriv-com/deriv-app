import React from 'react';
import { useLocation } from 'react-router-dom';
import { useExtendedOrderDetails } from '@/hooks';
import { p2p, useActiveAccount, useServerTime } from '@deriv/api-v2';
import { OrdersChatSection } from '../OrdersChatSection';

const OrderDetails = () => {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const orderId = urlParams.get('order') ?? '';
    const { data: orderInfo } = p2p.order.useGet(orderId);
    const { data: activeAccount } = useActiveAccount();
    const { data: serverTime } = useServerTime();
    const { data: orderDetails } = useExtendedOrderDetails({
        loginId: activeAccount?.loginid,
        orderDetails: orderInfo,
        serverTime,
    });
    return (
        <div className='grid grid-cols-none lg:grid-cols-2'>
            <OrdersChatSection
                id={orderId}
                isInactive={!!orderDetails?.isInactiveOrder}
                otherUserDetails={orderDetails?.otherUserDetails}
            />
        </div>
    );
};

export default OrderDetails;
