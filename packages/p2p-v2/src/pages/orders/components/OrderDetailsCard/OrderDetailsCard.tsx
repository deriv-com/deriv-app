import React from 'react';
import { ExtendedOrderDetails } from '@/hooks/useExtendedOrderDetails';
import { Divider } from '@deriv-com/ui';
import { OrderDetailsCardFooter } from './OrderDetailsCardFooter';
import { OrderDetailsCardHeader } from './OrderDetailsCardHeader';
import { OrderDetailsCardInfo } from './OrderDetailsCardInfo';
import { OrderDetailsCardReview } from './OrderDetailsCardReview';
import './OrderDetailsCard.scss';

type TOrderDetailsCardProps = {
    orderDetails: ExtendedOrderDetails;
};

const OrderDetailsCard = ({ orderDetails }: TOrderDetailsCardProps) => {
    return (
        <div className='p2p-v2-order-details-card'>
            <OrderDetailsCardHeader orderDetails={orderDetails} />
            <Divider color='#f2f3f4' />
            <OrderDetailsCardInfo orderDetails={orderDetails} />
            <Divider color='#f2f3f4' />
            <OrderDetailsCardReview orderDetails={orderDetails} />
            <OrderDetailsCardFooter orderDetails={orderDetails} />
        </div>
    );
};

export default OrderDetailsCard;
