import React from 'react';
import { Text } from '@deriv/components';
import { useCountdown } from '@deriv/hooks';
import { Localize } from '@deriv/translations';

type TTimerProps = {
    className?: string;
    from: number;
    onComplete?: VoidFunction;
};

export type TTimerRef = {
    reset: VoidFunction;
};

const Timer = React.forwardRef<TTimerRef, TTimerProps>(({ className, from, onComplete }, ref) => {
    const { count, reset, start } = useCountdown({ from });

    React.useImperativeHandle(ref, () => ({
        reset,
    }));

    React.useEffect(() => {
        if (count === 0) {
            onComplete?.();
            reset();
        }
    }, [count, onComplete, reset]);

    React.useEffect(() => start(), [start]);

    return (
        <Text as='p' size='xs' color='less-prominent' className={className}>
            <Localize i18n_default_text='{{remaining_time}}s' values={{ remaining_time: count }} />
        </Text>
    );
});

Timer.displayName = 'Timer';

export default Timer;
