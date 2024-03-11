import React from 'react';
import { render, screen } from '@testing-library/react';
import Orders from '../Orders';

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
    it('should render Orders comopnent', () => {
        render(<Orders />);
        expect(screen.getByText('OrdersTable')).toBeInTheDocument();
        expect(screen.getByText('OrdersTableHeader')).toBeInTheDocument();
    });
});
