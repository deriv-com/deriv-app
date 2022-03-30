import React from 'react';
import { render, screen } from '@testing-library/react';
import OrderTable from '../order-table.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn().mockReturnValue({
        general_store: {
            active_notification_count: 0,
            inactive_notification_count: 0,
            order_table_type: false,
        },
    }),
}));

jest.mock('Components/misc/toggle-container.jsx', () => jest.fn(() => <div>Toggle</div>));
jest.mock('Components/orders/order-table/order-table-content.jsx', () => jest.fn(() => <div>Order Table Content</div>));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    ButtonToggle: jest.fn(() => <div>Toggle Button</div>),
}));

describe('<Orders/>', () => {
    it('should pass the values into OrderTableContent', () => {
        render(<OrderTable />);
        expect(screen.getByText('Order Table Content')).toBeInTheDocument();
    });
});
