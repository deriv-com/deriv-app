import React from 'react';
import { render, screen } from '@testing-library/react';
import Timer from '../timer';

describe('<Timer />', () => {
    it('starts the countdown automatically', () => {
        const countdown = {
            count: 5,
            reset: jest.fn(),
            start: jest.fn(),
        };

        render(<Timer countdown={countdown} />);

        expect(countdown.start).toHaveBeenCalledTimes(1);
    });

    it('calls onComplete when countdown reaches zero', async () => {
        const onComplete = jest.fn();
        const countdown = {
            count: 0,
            reset: jest.fn(),
            start: jest.fn(),
        };

        render(<Timer countdown={countdown} onComplete={onComplete} />);

        expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('resets the countdown after reaching zero', () => {
        const countdown = {
            count: 0,
            reset: jest.fn(),
            start: jest.fn(),
        };

        render(<Timer countdown={countdown} />);

        expect(countdown.reset).toHaveBeenCalledTimes(1);
    });

    it('displays the correct countdown time', () => {
        const countdown = {
            count: 5,
            reset: jest.fn(),
            start: jest.fn(),
        };

        render(<Timer countdown={countdown} />);

        expect(screen.getByText('5s')).toBeInTheDocument();
    });
});
