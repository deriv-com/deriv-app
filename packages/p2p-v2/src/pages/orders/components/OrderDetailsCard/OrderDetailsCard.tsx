import React from 'react';
import { Divider, Text } from '@deriv-com/ui';
import { OrderDetailsCardHeader } from './OrderDetailsCardHeader';
import { OrderDetailsInfo } from './OrderDetailsInfo';
import './OrderDetailsCard.scss';

// TODO: remove this mock data when integrating real confirm order flow
const mockExpiryTime = new Date().getTime() + 1 * 3600000;

const mockOrderDetails = {
    displayPaymentAmount: '155000.00',
    id: '1',
    localCurrency: 'USD',
    orderExpiryMilliseconds: mockExpiryTime,
    statusString: 'Wait for payment',
};

type TOrderDetailsCardProps = {
    orderId: string;
};

// TODO: pass id down to this component, and call useOrderInfo to get order details
const OrderDetailsCard = ({ orderId }: TOrderDetailsCardProps) => {
    // Uncomment this when integrating real confirm order flow
    // const { data: orderDetails } = p2p.order.useGet(orderId);

    const { displayPaymentAmount, id, localCurrency, orderExpiryMilliseconds, statusString } = mockOrderDetails;

    const orderDetails = [
        { text: 'Buyer’s nickname', value: 'client CR90000343' },
        { text: 'Buyer’s real name', value: 'Bob' },
        { text: 'Receive', value: '155000.00 IDR' },
        { text: 'Send', value: '10.00 USD' },
        { text: 'Rate (1 USD)', value: '15500.00 IDR' },
        { text: 'Time', value: '01 Jan 2022, 00:00' },
    ];

    return (
        <div className='p2p-v2-order-details-card'>
            <OrderDetailsCardHeader
                localCurrency={localCurrency}
                orderAmount={displayPaymentAmount}
                orderExpiryTime={orderExpiryMilliseconds}
                orderId={id}
                orderStatus={statusString}
            />
            <Divider color='#f2f3f4' />
            <OrderDetailsInfo orderDetails={orderDetails} />
        </div>
    );
};

export default OrderDetailsCard;
