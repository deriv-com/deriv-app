import React from 'react';
import { TCountdownComponent } from 'Containers/props.types';

export const CountdownComponent = ({ count_from = 60, onTimeout }: TCountdownComponent) => {
    const [count, setCount] = React.useState<number>(count_from);

    React.useEffect(() => {
        let interval: ReturnType<typeof setTimeout>;

        if (count !== 0) {
            interval = setTimeout(() => {
                setCount(count - 1);
            }, 1000);
        } else {
            onTimeout();
        }

        return () => {
            clearTimeout(interval);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count]);
    return <span className='countdown'>{count}</span>;
};
