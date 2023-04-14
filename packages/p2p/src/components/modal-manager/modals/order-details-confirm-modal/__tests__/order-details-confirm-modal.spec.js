import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useStores } from 'Stores';
import OrderDetailsConfirmModal from '../order-details-confirm-modal.jsx';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const el_modal = document.createElement('div');

jest.mock('Utils/websocket', () => ({
    ...jest.requireActual('Utils/websocket'),
    requestWS: jest.fn().mockResolvedValue({ error: { message: 'P2P Error' } }),
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn().mockReturnValue({
        order_details_store: {
            error_message: '',
        },
        order_store: {
            confirmOrderRequest: jest.fn(),
            order_information: {
                amount: 10,
                id: 1,
                local_currency: 'AED',
                other_user_details: { name: 'P2P' },
                rate: 2,
            },
        },
        sendbird_store: {
            sendFile: jest.fn(),
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

describe('<OrderDetailsConfirmModal/>', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });
    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render the modal', () => {
        render(<OrderDetailsConfirmModal />);

        expect(screen.getByText('Payment confirmation')).toBeInTheDocument();
        expect(
            screen.getByText(
                "Please make sure that you've paid 20.00 AED to P2P, and upload the receipt as proof of your payment"
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Confirm')).toBeInTheDocument();
        expect(screen.getByText('Go Back')).toBeInTheDocument();
        expect(screen.getByText('We accept JPG, PDF, or PNG (up to 2MB).')).toBeInTheDocument();
    });
    it('should handle GoBack Click', () => {
        const { hideModal } = useModalManagerContext();

        render(<OrderDetailsConfirmModal />);

        const cancel_button = screen.getByRole('button', { name: 'Go Back' });
        expect(cancel_button).toBeInTheDocument();
        fireEvent.click(cancel_button);
        expect(hideModal).toHaveBeenCalled();
    });
    it('should send a request when confirm button is clicked', async () => {
        const { order_store, sendbird_store } = useStores();
        const { hideModal } = useModalManagerContext();
        const { confirmOrderRequest, order_information } = order_store;

        render(<OrderDetailsConfirmModal />);
        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        const input = screen.getByTestId('dt_file_upload_input');
        fireEvent.change(input, { target: { files: [file] } });
        await waitFor(() => {
            expect(input.files[0]).toBe(file);
            expect(input.files).toHaveLength(1);
        });

        const confirm_button = screen.getByRole('button', { name: 'Confirm' });
        expect(confirm_button).toBeInTheDocument();
        expect(confirm_button).toBeEnabled();
        fireEvent.click(confirm_button);
        await waitFor(() => {
            expect(sendbird_store.sendFile).toHaveBeenCalled();
            expect(confirmOrderRequest).toHaveBeenCalledWith(order_information.id, true);
            expect(hideModal).toHaveBeenCalled();
        });
    });
});
