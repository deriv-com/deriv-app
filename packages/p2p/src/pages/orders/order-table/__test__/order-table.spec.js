import React from 'react';
import { render, screen } from '@testing-library/react';
import OrderTable from '../order-table.jsx';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn().mockReturnValue({
        general_store: {
            active_notification_count: 0,
            inactive_notification_count: 0,
            order_table_type: false,
        },
        order_store: {
            date_from: '',
            date_to: '',
            filtered_date_range: '',
            handleDateChange: jest.fn(),
            setDateTo: jest.fn(),
        },
    }),
}));

jest.mock('Components/toggle-container/toggle-container', () => jest.fn(() => <div>Toggle</div>));
jest.mock('Pages/orders/order-table/order-table-content.jsx', () => jest.fn(() => <div>Order Table Content</div>));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    ButtonToggle: jest.fn(() => <div>Toggle Button</div>),
}));

describe('<Orders/>', () => {
    it('should pass the values into OrderTableContent', () => {
        render(
            <StoreProvider store={mockStore({})}>
                <OrderTable />
            </StoreProvider>
        );
        expect(screen.getByText('Order Table Content')).toBeInTheDocument();
    });
});
