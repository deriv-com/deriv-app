import { useEffect, useState } from 'react';

/**
 * Custom hook for a countdown timer.
 * @param {number} initialSeconds - The initial number of seconds for the countdown timer.
 * @param {number} interval - The interval in milliseconds at which the timer will update.
 * @returns {number} - The current value of the countdown timer in seconds.
 */
const useCountdownTimer = (initialMilliseconds: number, interval = 1000) => {
    const [milliseconds, setMilliseconds] = useState(initialMilliseconds > 0 ? initialMilliseconds : 0);

    useEffect(() => {
        if (milliseconds <= 0) return; // Stop the timer if milliseconds reach 0

        const timerId = setInterval(() => {
            setMilliseconds(prevMilliseconds => prevMilliseconds - interval);
        }, interval);

        // Clear the interval when the component unmounts or when milliseconds reach 0
        return () => clearInterval(timerId);
    }, [milliseconds, interval]);

    return milliseconds;
};

export default useCountdownTimer;
