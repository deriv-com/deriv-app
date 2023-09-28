import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TCountdown = {
    count: number;
    reset: VoidFunction;
    start: VoidFunction;
};

type TTimerProps = {
    className?: string;
    countdown: TCountdown;
    onComplete?: VoidFunction;
};

const Timer = ({ className, countdown, onComplete }: TTimerProps) => {
    const { count, reset, start } = countdown;

    React.useEffect(() => start(), [start]);

    React.useEffect(() => {
        if (count === 0) {
            onComplete?.();
            reset();
        }
    }, [count, onComplete, reset]);

    return (
        <Text as='p' size='xs' color='less-prominent' className={className}>
            <Localize i18n_default_text='{{remaining_time}}s' values={{ remaining_time: count }} />
        </Text>
    );
};

export default Timer;
