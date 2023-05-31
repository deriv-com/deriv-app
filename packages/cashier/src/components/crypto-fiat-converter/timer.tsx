import React from 'react';
import { Localize } from '@deriv/translations';
import { Text, useInterval } from '@deriv/components';

type TTimerProps = {
    onComplete: VoidFunction;
};

const Timer = ({ onComplete }: TTimerProps) => {
    const initial_time = 60;
    const [remaining_time, setRemainingTime] = React.useState<number>(initial_time);

    useInterval(() => {
        if (remaining_time > 0) {
            setRemainingTime(remaining_time - 1);
        }
    }, 1000);

    React.useEffect(() => {
        if (remaining_time === 0) {
            onComplete();
            setRemainingTime(initial_time);
        }
    }, [onComplete, remaining_time]);

    return (
        <Text as='p' size='xs' color='less-prominent' className='timer'>
            <Localize i18n_default_text='{{remaining_time}}s' values={{ remaining_time }} />
        </Text>
    );
};

export default Timer;
