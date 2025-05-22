import React from 'react';
import { screen, render } from '@testing-library/react';
import MarketCountdownTimer from '..';

describe('MarketCountDownTimer', () => {
    it('renders correctly with given time left', () => {
        render(<MarketCountdownTimer time_left={{ days: 1, hours: 2, minutes: 3, seconds: 4 }} />);

        expect(screen.getByText('26:03:04')).toBeInTheDocument();
    });
    it('renders correctly when there is no time left', () => {
        render(<MarketCountdownTimer time_left={{ days: 0, hours: 0, minutes: 0, seconds: 0 }} />);

        expect(screen.getByText('00:00:00')).toBeInTheDocument();
    });
    it('renders correctly with edge case values', () => {
        render(<MarketCountdownTimer time_left={{ days: 0, hours: 1, minutes: 1, seconds: 1 }} />);

        expect(screen.getByText('01:01:01')).toBeInTheDocument();
    });
});
