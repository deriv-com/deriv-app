import React from 'react';
import { render, screen } from '@testing-library/react';
import { useStores } from 'Stores';
import { useSafeState } from '@deriv/components';
import Orders from '../orders.jsx';

const mock_store = {
    general_store: {
        active_index: 2,
        setActiveIndex: jest.fn(),
    },
    order_store: {
        order_id: null,
        order_information: '',
        orders: [],
        onOrderIdUpdate: jest.fn(),
        onOrdersUpdate: jest.fn(),
        onUnmount: jest.fn(),
        setForceRerenderOrders: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    useSafeState: jest.fn().mockReturnValue([{}, jest.fn()]),
}));

jest.mock('Components/orders/order-table/order-table.jsx', () => jest.fn(() => <div>Order Table</div>));

jest.mock('Components/order-details/order-details.jsx', () => jest.fn(() => <div>Order Details</div>));

describe('<Orders/>', () => {
    it('should invoke setup methods on component load', () => {
        const { order_store } = useStores();
        const [, forceRerender] = useSafeState();
        render(<Orders />);

        expect(order_store.setForceRerenderOrders).toHaveBeenCalledWith(forceRerender);
        expect(order_store.onOrderIdUpdate).toHaveBeenCalled();
        expect(order_store.onOrdersUpdate).toHaveBeenCalled();
    });

    it('should list all orders via Order table component', () => {
        render(<Orders />);

        expect(screen.getByText('Order Table')).toBeInTheDocument();
    });

    it('should display the order details for a particular ', () => {
        mock_store.order_store.order_information = 'test';

        render(<Orders />);

        expect(screen.getByText('Order Details')).toBeInTheDocument();
    });
});
