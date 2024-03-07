import React from 'react';
import { useCountdownTimer } from '@/hooks';
import { millisecondsToTimer } from '@/utils';
import { Text, useDevice } from '@deriv-com/ui';
import './OrderTimer.scss';

type TOrderTimer = {
    distance: number;
};
const OrderTimer = ({ distance }: TOrderTimer) => {
    const { isMobile } = useDevice();
    const timeLeft = useCountdownTimer(distance);

    const formattedTime = timeLeft > 0 ? millisecondsToTimer(timeLeft) : 'expired';
    return (
        <Text className='p2p-v2-order-timer' size={isMobile ? 'sm' : 'xs'}>
            {formattedTime}
        </Text>
    );
};

export default OrderTimer;
