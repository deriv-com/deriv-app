import React from 'react';
import { useExtendedOrderDetails } from '@/hooks';
import { OrdersChatSection } from '../OrdersChatSection';
import './OrdersChat.scss';

type TOrdersChatProps = {
    id: string;
    orderDetails: ReturnType<typeof useExtendedOrderDetails>['data'];
};
const OrdersChat = ({ id, orderDetails }: TOrdersChatProps) => {
    return (
        <div className='flex justify-center p2p-v2-orders-chat max-h-[70vh]'>
            <OrdersChatSection id={id} otherUserDetails={orderDetails.otherUserDetails} />
        </div>
    );
};

export default OrdersChat;
