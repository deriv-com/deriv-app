import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useStores } from 'Stores';
import { requestWS } from 'Utils/websocket';
import OrderDetailsCancelModal from '../order-details-cancel-modal.jsx';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context.js';

const el_modal = document.createElement('div');

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
        general_store: {
            advertiser_info: {
                cancels_remaining: 10,
            },
        },
        order_store: {
            cancellation_block_duration: '17',
            cancellation_limit: '8',
            cancellation_count_period: '19',
            order_information: {
                id: '10',
            },
            setErrorMessage: jest.fn(),
        },
    }),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn().mockReturnValue({
        hideModal: jest.fn(),
        is_modal_open: true,
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
        render(<OrderDetailsCancelModal />);

        expect(screen.getByText('Do you want to cancel this order?')).toBeInTheDocument();
    });

    it('should warn the user if the number of remaining cancels is equal to 1 ', () => {
        const { general_store } = useStores();
        general_store.advertiser_info.cancels_remaining = 1;

        render(<OrderDetailsCancelModal />);

        expect(
            screen.getByText("If you cancel this order, you'll be blocked from using Deriv P2P for 17 hours.")
        ).toBeInTheDocument();
    });

    it('should not cancel the order and hide the modal if Do not Cancel button is clicked', () => {
        const { hideModal } = useModalManagerContext();

        render(<OrderDetailsCancelModal />);
        fireEvent.click(screen.getByRole('button', { name: 'Do not cancel' }));

        expect(hideModal).toHaveBeenCalled();
    });

    it('should cancel the order when Cancel this order button is clicked', () => {
        requestWS.mockResolvedValue({ message: 'Success' });
        render(<OrderDetailsCancelModal />);
        fireEvent.click(screen.getByRole('button', { name: 'Cancel this order' }));

        expect(requestWS).toHaveBeenCalled();
    });

    it('should show error message when error response is received', async () => {
        const error_msg = 'Error';
        const { order_store } = useStores();

        requestWS.mockResolvedValue({ error: { message: error_msg } });

        render(<OrderDetailsCancelModal />);
        fireEvent.click(screen.getByRole('button', { name: 'Cancel this order' }));

        await waitFor(() => {
            expect(order_store.setErrorMessage).toHaveBeenCalledWith(error_msg);
        });
    });
});
