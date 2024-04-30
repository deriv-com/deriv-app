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
        action_param: 'p2p_order_confirm',
        order_id: null,
        order_information: '',
        orders: [],
        verification_code: '123456',
        onOrderIdUpdate: jest.fn(),
        onOrdersUpdate: jest.fn(),
        onUnmount: jest.fn(),
        setForceRerenderOrders: jest.fn(),
        verifyEmailVerificationCode: jest.fn(),
    },
};

const mock_modal_manager = {
    showModal: jest.fn(),
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    useSafeState: jest.fn().mockReturnValue([{}, jest.fn()]),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

jest.mock('Pages/orders/order-table/order-table.jsx', () => jest.fn(() => <div>Order Table</div>));

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

    it('should call showModal and verifyEmailVerification when verification code and action_param is present', () => {
        render(<Orders />);

        expect(mock_modal_manager.showModal).toHaveBeenCalledWith({ key: 'LoadingModal', props: {} });
        expect(mock_store.order_store.verifyEmailVerificationCode).toHaveBeenCalledWith('p2p_order_confirm', '123456');
    });
});
