import React from 'react';
import { useStores } from 'Stores';
import { getDistanceToServerTime } from 'Utils/server_time';
import { render, screen } from '@testing-library/react';
import OrderDetailsTimer from '../order-details-timer.jsx';

const mock_order_info = {
    order_expiry_milliseconds: 0,
    should_show_order_timer: true,
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        order_store: {
            order_information: { ...mock_order_info },
        },
    })),
}));

jest.mock('Utils/server_time', () => ({
    getDistanceToServerTime: jest.fn().mockReturnValue(8),
}));

jest.mock('Utils/date-time', () => ({
    millisecondsToTimer: jest.fn().mockReturnValue(17),
}));

describe('<OrderDetailsTimer/>', () => {
    it('should render the component when show_order_timer status is set', () => {
        render(<OrderDetailsTimer />);

        expect(screen.getByText('17')).toBeInTheDocument();
    });

    it('should not render the component when show_order_timer set to false', () => {
        useStores.mockReturnValue({
            order_store: {
                order_information: { ...mock_order_info, should_show_order_timer: false },
            },
        });
        render(<OrderDetailsTimer />);

        expect(screen.queryByText('Time left')).not.toBeInTheDocument();
    });

    it('should invoke clearInterval method when timer expires', () => {
        const spiedClearIntervalFn = jest.spyOn(global, 'clearInterval');
        getDistanceToServerTime.mockReturnValue(-1);
        render(<OrderDetailsTimer />);

        expect(spiedClearIntervalFn).toHaveBeenCalled();
    });
});
