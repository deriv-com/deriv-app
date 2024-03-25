import React from 'react';
import { Divider, useDevice } from '@deriv-com/ui';
import { OrderDetailsCardFooter } from './OrderDetailsCardFooter';
import { OrderDetailsCardHeader } from './OrderDetailsCardHeader';
import { OrderDetailsCardInfo } from './OrderDetailsCardInfo';
import { OrderDetailsCardReview } from './OrderDetailsCardReview';
import './OrderDetailsCard.scss';

const OrderDetailsCard = () => {
    const { isDesktop } = useDevice();

    return (
        <div className='p2p-v2-order-details-card'>
            <OrderDetailsCardHeader />
            <Divider color='#f2f3f4' />
            <OrderDetailsCardInfo />
            <Divider color='#f2f3f4' />
            <OrderDetailsCardReview />
            {isDesktop && <OrderDetailsCardFooter />}
        </div>
    );
};

export default OrderDetailsCard;
