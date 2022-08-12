import React from 'react';
import { render, screen } from '@testing-library/react';
import CashierNotifications from '../cashier-notifications';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components') as any;

    return {
        ...original_module,
        Icon: jest.fn(() => 'mockedIcon'),
        Counter: jest.fn(() => 'mockedCounter'),
    };
});

describe('<CashierNotifications />', () => {
    it('should only show the icon if there are no p2p notifications', () => {
        render(<CashierNotifications p2p_notification_count={0} />);

        expect(screen.getByText('mockedIcon')).toBeInTheDocument();
    });

    it('should show the icon and no. of notifications if there are p2p notifications', () => {
        render(<CashierNotifications p2p_notification_count={2} />);

        expect(screen.getByText(/mockedIcon/i)).toBeInTheDocument();
        expect(screen.getByText(/mockedCounter/i)).toBeInTheDocument();
    });
});
