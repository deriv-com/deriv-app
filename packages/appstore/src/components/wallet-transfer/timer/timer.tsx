import React from 'react';
import { Text } from '@deriv/components';
import { useCountdown } from '@deriv/hooks';
import { Localize } from '@deriv/translations';

type TTimerProps = {
    className?: string;
    from: number;
    onComplete?: VoidFunction;
};

const Timer = ({ className, from, onComplete }: TTimerProps) => {
    const { count, reset, start } = useCountdown({ from });

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
