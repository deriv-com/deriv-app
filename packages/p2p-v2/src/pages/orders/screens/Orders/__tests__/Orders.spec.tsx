import React from 'react';
import { render, screen } from '@testing-library/react';
import Orders from '../Orders';

let mockSearch = '?order=1';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        search: mockSearch,
    }),
}));

jest.mock('@deriv/api-v2', () => ({
    p2p: {
        order: {
            useGetList: () => ({
                data: [],
                isFetching: false,
                isLoading: false,
                loadMoreOrders: () => undefined,
            }),
        },
    },
}));

jest.mock('@/hooks', () => ({
    useQueryString: () => ({ queryString: { get: () => 'Active orders' } }),
}));

jest.mock('../OrdersTable', () => ({
    OrdersTable: () => <div>OrdersTable</div>,
}));

jest.mock('../OrdersTableHeader', () => ({
    OrdersTableHeader: () => <div>OrdersTableHeader</div>,
}));

jest.mock('@deriv-com/ui', () => ({
    useDevice: () => ({ isMobile: false }),
}));

describe('Orders', () => {
    it('should render the OrdersTable if order id is not in the search query', () => {
        mockSearch = '';

        render(<Orders />);

        expect(screen.getByText('OrdersTableHeader')).toBeInTheDocument();
        expect(screen.getByText('OrdersTable')).toBeInTheDocument();
    });
});
