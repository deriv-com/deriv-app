import { useEffect, useRef, useState } from 'react';

/** We can use this hook to limit how frequently updates occur for the given value.
 * It ensures that the value can only be updated once the set time interval has passed since the last update.
 */
const useThrottle = <T>(value: T, interval = 500): T => {
    const [throttledValue, setThrottledValue] = useState<T>(value);
    const lastExecuted = useRef<number>(Date.now());

    useEffect(() => {
        if (Date.now() >= lastExecuted.current + interval) {
            lastExecuted.current = Date.now();
            setThrottledValue(value);
        } else {
            const timerId = setTimeout(() => {
                lastExecuted.current = Date.now();
                setThrottledValue(value);
            }, interval);

            return () => clearTimeout(timerId);
        }
    }, [value, interval]);

    return throttledValue;
};

export default useThrottle;
