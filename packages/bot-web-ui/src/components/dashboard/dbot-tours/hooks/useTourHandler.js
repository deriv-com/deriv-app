import { useState } from 'react';

export default function useTourHandler() {
    const [is_finished, setIsFinished] = useState(false);
    const [is_close_tour, setIsCloseTour] = useState(false);

    const handleJoyrideCallback = data => {
        const { action, status } = data;
        if (status === 'finished') {
            setIsFinished(true);
        } else if (action === 'close' || action === 'skip') {
            setIsCloseTour(true);
        }
    };

    return {
        is_finished,
        handleJoyrideCallback,
        setIsFinished,
        is_close_tour,
        setIsCloseTour,
    };
}
