import React, { useEffect } from 'react';
import { useCountdown } from 'usehooks-ts';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';

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
        <Text as='p' color='less-prominent' size='sm'>
            <Localize i18n_default_text='{{count}}s' values={{ count }} />
        </Text>
    );
};

export default Timer;
