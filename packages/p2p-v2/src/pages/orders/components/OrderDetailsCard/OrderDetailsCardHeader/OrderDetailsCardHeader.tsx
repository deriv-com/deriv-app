import React from 'react';
import { getDistanceToServerTime } from '@/utils';
import { useServerTime } from '@deriv/api-v2';
import { Text } from '@deriv-com/ui';
import { OrderTimer } from '../../OrderTimer';

type TOrderDetailsCardProps = {
    localCurrency: string;
    orderAmount: string;
    orderExpiryTime: number;
    orderId: string;
    orderStatus: string;
};

const OrderDetailsCardHeader = ({
    localCurrency,
    orderAmount,
    orderExpiryTime,
    orderId,
    orderStatus,
}: TOrderDetailsCardProps) => {
    const { data: serverTime } = useServerTime();
    const distance = getDistanceToServerTime(orderExpiryTime, serverTime?.server_time_moment);

    return (
        <div className='flex justify-between p-[1.6rem]'>
            <div className='flex flex-col'>
                <Text color='warning' size='sm' weight='bold'>
                    {orderStatus}
                </Text>
                <Text size='xl'>
                    {orderAmount} {localCurrency}
                </Text>
                <Text color='less-prominent' size='xs'>
                    Order ID {orderId}
                </Text>
            </div>
            <div className='flex flex-col justify-center gap-1'>
                <Text align='center' size='xs'>
                    Time left
                </Text>
                <OrderTimer distance={distance} />
            </div>
        </div>
    );
};

export default OrderDetailsCardHeader;
