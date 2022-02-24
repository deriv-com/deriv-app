import { isMobile } from '@deriv/shared';
import { fireEvent, render, screen } from '@testing-library/react';
import { useStores } from 'Stores';
import React from 'react';
import { createExtendedOrderDetails } from 'Utils/orders';
import OrderTableContent from '../order-table-content.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Div100vhContainer: jest.fn(() => <div>Mobile container</div>),
    Loading: jest.fn(() => <div>Loading</div>),
    InfiniteDataList: jest.fn(() => <div>Data list</div>),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(),
}));

jest.mock('Components/orders/order-table/order-table-header.jsx', () => jest.fn(() => <div>Order table header</div>));

jest.mock('Components/table/table-error.jsx', () => ({ TableError: jest.fn(() => <div>Table Error</div>) }));

jest.mock('Utils/orders', () => ({
    ...jest.requireActual('Utils/orders'),
    createExtendedOrderDetails: jest.fn().mockReturnValue({ is_inactive_order: true }),
}));

describe('<OrderTableContent/>', () => {
    const mock_general_store = {
        order_table_type: null,
        client: {
            loginid: null,
        },
        props: {
            server_time: null,
        },
        is_active_tab: false,
        has_more_items_to_load: false,
        handleTabClick: jest.fn(),
    };
    const mock_order_store = {
        setIsLoading: jest.fn(),
        setOrders: jest.fn(),
        loadMoreOrders: jest.fn(),
        is_loading: false,
        api_error_message: '',
        orders: [],
    };

    it('should set up order_store methods on component load', () => {
        useStores.mockImplementation(() => ({
            general_store: { ...mock_general_store },
            order_store: { ...mock_order_store },
        }));
        const { order_store } = useStores();
        render(<OrderTableContent />);

        expect(order_store.setIsLoading).toHaveBeenCalledWith(true);
        expect(order_store.setOrders).toHaveBeenCalledWith([]);
        expect(order_store.loadMoreOrders).toHaveBeenCalledWith({ startIndex: 0 });
    });

    it('should render Empty component when no store condition matches', () => {
        render(<OrderTableContent />);

        expect(screen.getByText('You have no orders.')).toBeInTheDocument();
    });

    it('should switch tab when Buy/sell button is clicked', () => {
        useStores.mockImplementation(() => ({
            general_store: { ...mock_general_store, is_active_tab: true },
            order_store: { ...mock_order_store },
        }));
        const { general_store } = useStores();
        render(<OrderTableContent />);
        fireEvent.click(screen.getByRole('button'));

        expect(general_store.handleTabClick).toHaveBeenCalled();
    });

    it('should display is loading component when is_loading state is set', () => {
        useStores.mockImplementation(() => ({
            general_store: { ...mock_general_store },
            order_store: { ...mock_order_store, is_loading: true },
        }));
        render(<OrderTableContent />);

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should display API error message when api_error_message is set', () => {
        useStores.mockImplementation(() => ({
            general_store: { ...mock_general_store },
            order_store: { ...mock_order_store, api_error_message: true },
        }));
        render(<OrderTableContent />);
        expect(screen.getByText('Table Error')).toBeInTheDocument();
    });

    it('should invoke createExtendedOrderDetails when orders is set and render table', () => {
        useStores.mockImplementation(() => ({
            general_store: { ...mock_general_store },
            order_store: { ...mock_order_store, orders: [{}] },
        }));
        render(<OrderTableContent />);

        expect(createExtendedOrderDetails).toHaveBeenCalled();
        expect(screen.getByText('Order table header')).toBeInTheDocument();
    });

    it('should render mobile view when the display detected is mobile', () => {
        isMobile.mockReturnValue(true);
        useStores.mockImplementation(() => ({
            general_store: { ...mock_general_store },
            order_store: { ...mock_order_store, orders: [{}] },
        }));
        render(<OrderTableContent />);

        expect(screen.getByText('Mobile container')).toBeInTheDocument();
    });
});
