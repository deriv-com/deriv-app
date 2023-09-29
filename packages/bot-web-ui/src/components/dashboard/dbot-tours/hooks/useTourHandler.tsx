import { useState } from 'react';
import { CallBackProps } from 'react-joyride';

export const useTourHandler = () => {
    const [is_finished, setIsFinished] = useState(false);
    const [is_close_tour, setIsCloseTour] = useState(false);

    const handleJoyrideCallback = (data: CallBackProps) => {
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
};
