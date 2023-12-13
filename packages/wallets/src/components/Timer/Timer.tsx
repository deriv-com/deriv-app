import React, { useEffect } from 'react';
import { useCountdown } from 'usehooks-ts';
import { WalletText } from '../Base';

type TTimerProps = {
    countStart?: number;
    intervalMs?: number;
    onComplete?: VoidFunction;
};

const Timer = ({ countStart = 60, intervalMs = 1000, onComplete }: TTimerProps) => {
    const [count, { resetCountdown, startCountdown }] = useCountdown({
        countStart,
        intervalMs,
    });

    useEffect(() => startCountdown(), [startCountdown]);

    useEffect(() => {
        if (count === 0) {
            onComplete?.();
            resetCountdown();
            startCountdown();
        }
    }, [count, onComplete, resetCountdown, startCountdown]);

    return (
        <WalletText as='p' color='less-prominent' size='sm'>
            {`${count}s`}
        </WalletText>
    );
};

export default Timer;
