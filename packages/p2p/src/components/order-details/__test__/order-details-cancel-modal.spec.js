import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useStores } from 'Stores';
import { requestWS } from 'Utils/websocket';
import OrderDetailsCancelModal from '../order-details-cancel-modal.jsx';

const el_modal = document.createElement('div');
const mock_order_store = {
    setErrorMessage: jest.fn(),
    cancellation_block_duration: '17',
    cancellation_limit: '8',
    cancellation_count_period: '19',
    cancels_remaining: '95',
};

jest.mock('Utils/websocket', () => ({
    ...jest.requireActual('Utils/websocket'),
    requestWS: jest.fn().mockRejectedValue(),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    useIsMounted: jest.fn().mockReturnValue(() => true),
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn().mockReturnValue({
        order_store: { ...mock_order_store },
    }),
}));

describe('<OrderDetailsCancelModal/>', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });
    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render cancel modal in desktop ', () => {
        render(<OrderDetailsCancelModal should_show_cancel_modal />);

        expect(screen.getByText('Do you want to cancel this order?')).toBeInTheDocument();
    });

    it('should toggle modal ', () => {
        render(<OrderDetailsCancelModal hideCancelOrderModal={jest.fn()} />);

        expect(screen.queryByText("What's your complaint?")).not.toBeInTheDocument();
    });

    it('should not cancel the order when Do not Cancel button is clicked', () => {
        const mockFn = jest.fn();
        render(<OrderDetailsCancelModal should_show_cancel_modal hideCancelOrderModal={mockFn} />);
        fireEvent.click(screen.getByRole('button', { name: 'Do not cancel' }));

        expect(mockFn).toHaveBeenCalled();
    });

    it('should cancel the order when Cancel this order button is clicked', () => {
        requestWS.mockResolvedValue({ message: 'Passed' });
        render(<OrderDetailsCancelModal should_show_cancel_modal hideCancelOrderModal={jest.fn()} />);
        fireEvent.click(screen.getByRole('button', { name: 'Cancel this order' }));

        expect(requestWS).toHaveBeenCalled();
    });

    it('should not render error message when success response is obtained', () => {
        requestWS.mockResolvedValue({ message: 'Passed' });
        render(<OrderDetailsCancelModal should_show_cancel_modal hideCancelOrderModal={jest.fn()} />);
        fireEvent.click(screen.getByRole('button', { name: 'Cancel this order' }));

        expect(screen.queryByText('P2P error test')).not.toBeInTheDocument();
    });

    it('should show error message when error response is received', () => {
        const error_msg = 'P2P error test';
        requestWS.mockResolvedValue({ error: { message: error_msg } });
        useStores.mockReturnValue({ order_store: { ...mock_order_store, error_message: error_msg } });
        render(<OrderDetailsCancelModal should_show_cancel_modal hideCancelOrderModal={jest.fn()} />);
        fireEvent.click(screen.getByRole('button', { name: 'Cancel this order' }));

        expect(screen.getByText(error_msg)).toBeInTheDocument();
    });
});
