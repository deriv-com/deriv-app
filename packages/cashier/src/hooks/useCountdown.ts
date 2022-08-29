import { useEffect, useState } from 'react';

const ONE_SECOND = 1000;

type TCountdownOptions = {
    from: number;
    to?: number;
    increment?: boolean;
};

const useCountdown = ({ from, to = 0, increment = false }: TCountdownOptions) => {
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
        start,
        pause,
        reset,
        stop,
    };
};

export default useCountdown;
