import React from 'react';
import { screen, render } from '@testing-library/react';
import MarketOpeningTimeBanner from '../market-opening-time-banner';

jest.mock('@deriv/shared', () => ({
    convertTimeFormat: jest.fn(time => `Formatted: ${time}`),
    toMoment: jest.fn(() => ({
        locale: jest.fn().mockReturnThis(),
        add: jest.fn().mockReturnThis(),
        format: jest.fn(() => '01 Jan 2024'),
    })),
}));

describe('<MarketOpeningTimeBanner />', () => {
    it('renders with correct formatted time and date', () => {
        render(<MarketOpeningTimeBanner opening_time='12:34' days_offset={1} current_language='en' />);

        expect(screen.getByText('Formatted: 12:34 (GMT), 01 Jan 2024')).toBeInTheDocument();
    });
});
