import React from 'react';
import { render, screen } from '@testing-library/react';
import SideList from '../side-list';
import { toMoment } from '@deriv/shared';

const mockDefaultProps = {
    items: [
        {
            value: 'all_time',
            label: 'All time',
            duration: 0,
            onClick: jest.fn(),
        },
        {
            value: 'last_7_days',
            label: 'Last 7 days',
            duration: 7,
            onClick: jest.fn(),
        },
        {
            value: 'last_30_days',
            label: 'Last 30 days',
            duration: 30,
            onClick: jest.fn(),
        },
        {
            value: 'last_60_days',
            label: 'Last 60 days',
            duration: 60,
            onClick: jest.fn(),
        },
        {
            value: 'last_quarter',
            label: 'Last quarter',
            duration: 90,
            onClick: jest.fn(),
        },
    ],
    from: 1713398400,
    to: 1717286399,
};

describe('SideList', () => {
    it('should render component with default props', () => {
        render(<SideList {...mockDefaultProps} />);

        mockDefaultProps.items.forEach(item => expect(screen.getByText(item.label)).toBeInTheDocument());
    });

    it('should render first list item with specific className if its duration === 0, from === null and to === today (end of the day)', () => {
        render(<SideList {...mockDefaultProps} from={null} to={toMoment().endOf('day').unix()} />);

        mockDefaultProps.items.forEach(item => expect(screen.getByText(item.label)).toBeInTheDocument());
        expect(screen.getByText(mockDefaultProps.items[0].label)).toHaveClass(
            'composite-calendar__prepopulated-list--is-active'
        );
    });
});
