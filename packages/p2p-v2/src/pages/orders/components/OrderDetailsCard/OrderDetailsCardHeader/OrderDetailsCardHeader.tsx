import React from 'react';
import { ExtendedOrderDetails } from '@/hooks/useExtendedOrderDetails';
import { getDistanceToServerTime } from '@/utils';
import { useServerTime } from '@deriv/api-v2';
import { Text, useDevice } from '@deriv-com/ui';
import { OrderTimer } from '../../OrderTimer';

type TOrderDetailsCardProps = {
    orderDetails: ExtendedOrderDetails;
};

const OrderDetailsCardHeader = ({ orderDetails }: TOrderDetailsCardProps) => {
    const {
        displayPaymentAmount,
        hasTimerExpired,
        id,
        isBuyerConfirmedOrder,
        isPendingOrder,
        local_currency: localCurrency,
        orderExpiryMilliseconds,
        shouldHighlightAlert,
        shouldHighlightDanger,
        shouldHighlightSuccess,
        shouldShowOrderTimer,
        statusString,
    } = orderDetails;

    const { isMobile } = useDevice();
    const textSize = isMobile ? 'sm' : 'xs';
    const { data: serverTime } = useServerTime();
    const distance = getDistanceToServerTime(orderExpiryMilliseconds, serverTime?.server_time_moment);
    const getStatusColor = () => {
        if (shouldHighlightAlert) return 'warning';
        else if (shouldHighlightDanger) return 'error';
        else if (shouldHighlightSuccess) return 'success';
        return 'less-prominent';
    };

    return (
        <div className='flex justify-between p-[1.6rem]'>
            <div className='flex flex-col gap-1'>
                <Text color={getStatusColor()} size={isMobile ? 'lg' : 'md'} weight='bold'>
                    {statusString}
                </Text>
                {!hasTimerExpired && (isPendingOrder || isBuyerConfirmedOrder) && (
                    <Text size={isMobile ? '2xl' : 'xl'}>
                        {displayPaymentAmount} {localCurrency}
                    </Text>
                )}
                <Text color='less-prominent' size={textSize}>
                    Order ID {id}
                </Text>
            </div>
            {shouldShowOrderTimer && (
                <div className='flex flex-col justify-center gap-1'>
                    <Text align='center' size={textSize}>
                        Time left
                    </Text>
                    <OrderTimer distance={distance} />
                </div>
            )}
        </div>
    );
};

export default OrderDetailsCardHeader;
