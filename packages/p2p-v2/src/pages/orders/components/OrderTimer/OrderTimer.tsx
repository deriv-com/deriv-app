import React, { useEffect } from 'react';
import { useCountdown } from 'usehooks-ts';
import { millisecondsToTimer } from '@/utils';
import { Text, useDevice } from '@deriv-com/ui';
import './OrderTimer.scss';

type TOrderTimer = {
    distance: number;
};
const OrderTimer = ({ distance }: TOrderTimer) => {
    const { isMobile } = useDevice();
    const [timeLeft, { startCountdown }] = useCountdown({
        countStart: distance / 1000,
        intervalMs: 1000,
    });

    useEffect(() => {
        if (distance > 0) {
            startCountdown();
        }
    }, [distance, startCountdown]);

    return (
        <Text className='p2p-v2-order-timer' size={isMobile ? 'sm' : 'xs'}>
            {timeLeft > 0 ? millisecondsToTimer(timeLeft * 1000) : 'expired'}
        </Text>
    );
};

export default OrderTimer;
