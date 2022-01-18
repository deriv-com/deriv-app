import React from 'react';
import { render } from '@testing-library/react';
import CashierNotifications from '../cashier-notifications';
import { Icon, Counter } from '@deriv/components';

jest.mock('@deriv/components', () => ({
    __esModule: true,
    Icon: jest.fn(() => 'mockedIcon'),
    Counter: jest.fn(() => 'mockedCounter'),
}));

describe('<CashierNotifications />', () => {
    it('should only show the icon if there are no p2p notifications', () => {
        render(<CashierNotifications p2p_notification_count={0} />);

        expect(Icon).toHaveBeenCalled();
    });

    it('should show the no. of notifications if there are p2p notifications', () => {
        render(<CashierNotifications p2p_notification_count={2} />);

        expect(Icon).toHaveBeenCalled();
        expect(Counter).toHaveBeenCalled();
    });
});
