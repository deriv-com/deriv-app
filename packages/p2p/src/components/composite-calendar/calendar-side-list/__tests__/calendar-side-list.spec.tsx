import React from 'react';
import { render, screen } from '@testing-library/react';
import CalendarSideList from '../calendar-side-list';

const mock_props = {
    from: 0,
    items: [
        {
            value: 'all_time',
            label: 'All time',
            onClick: jest.fn(),
            duration: 0,
        },
    ],
    to: 0,
};

describe('CalendarSideList', () => {
    it('should render the side list for duration as 0', () => {
        render(<CalendarSideList {...mock_props} />);
        expect(screen.getByText('All time')).toBeInTheDocument();
    });
    it('should render the side list for duation as non-zero', () => {
        const new_props = {
            ...mock_props,
            items: [
                {
                    value: 'last_7_days',
                    label: 'Last 7 days',
                    onClick: jest.fn(),
                    duration: 7,
                },
            ],
        };
        render(<CalendarSideList {...new_props} />);
        expect(screen.getByText('Last 7 days')).toBeInTheDocument();
    });
});
