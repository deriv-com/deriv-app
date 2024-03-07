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
    OrdersTable: () => <div data-testid='dt_p2p_v2_orders_table' />,
}));

jest.mock('../OrdersTableHeader', () => ({
    OrdersTableHeader: () => <div data-testid='dt_p2p_v2_orders_table_header' />,
}));

jest.mock('@deriv-com/ui', () => ({
    useDevice: () => ({ isMobile: false }),
}));

describe('Orders', () => {
    it('should render Orders comopnent', () => {
        render(<Orders />);
        expect(screen.getByTestId('dt_p2p_v2_orders_table')).toBeInTheDocument();
        expect(screen.getByTestId('dt_p2p_v2_orders_table_header')).toBeInTheDocument();
    });
});
