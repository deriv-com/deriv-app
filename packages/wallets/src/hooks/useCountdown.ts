import { useEffect, useState } from 'react';

const ONE_SECOND = 1000;

export type TCountdownOptions = {
    from: number;
    increment?: boolean;
    to?: number;
};

const useCountdown = ({ from, increment = false, to = 0 }: TCountdownOptions) => {
    const [count, setCount] = useState(from);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isRunning) {
            timer = setTimeout(() => {
                if (count === to) {
                    pause();
                } else {
                    setCount(old => (increment ? old + 1 : old - 1));
                }
            }, ONE_SECOND);
        }

        return () => clearTimeout(timer);
    }, [count, isRunning, to, increment]);

    const start = () => setIsRunning(true);

    const pause = () => setIsRunning(false);

    const reset = () => setCount(from);

    const stop = () => {
        pause();
        reset();
    };

    return {
        count,
        isRunning,
        pause,
        reset,
        start,
        stop,
    };
};

export default useCountdown;
