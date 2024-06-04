import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import OrderDetailsConfirmModal from '../order-details-confirm-modal';

const el_modal = document.createElement('div');

const wrapper = ({ children }: React.PropsWithChildren) => (
    <StoreProvider store={mockStore({})}>{children}</StoreProvider>
);

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
                amount_display: 10,
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
        render(<OrderDetailsConfirmModal />, { wrapper });

        expect(screen.getByText('Payment confirmation')).toBeInTheDocument();
        expect(
            screen.getByText(
                "Please make sure that you've paid 20.00 AED to P2P, and upload the receipt as proof of your payment"
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Confirm')).toBeInTheDocument();
        expect(screen.getByText('Go Back')).toBeInTheDocument();
        expect(screen.getByText('We accept JPG, PDF, or PNG (up to 5MB).')).toBeInTheDocument();
        expect(
            screen.getByText('Sending forged documents will result in an immediate and permanent ban.')
        ).toBeInTheDocument();
    });
    it('should handle GoBack Click', () => {
        const { hideModal } = useModalManagerContext();

        render(<OrderDetailsConfirmModal />, { wrapper });

        const cancel_button = screen.getByRole('button', { name: 'Go Back' });
        expect(cancel_button).toBeInTheDocument();
        userEvent.click(cancel_button);
        expect(hideModal).toHaveBeenCalled();
    });
    it('should send a request when confirm button is clicked', async () => {
        const { order_store, sendbird_store } = useStores();
        const { hideModal } = useModalManagerContext();
        const { confirmOrderRequest, order_information } = order_store;

        render(<OrderDetailsConfirmModal />, { wrapper });

        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        const input: HTMLInputElement = screen.getByTestId('dt_file_upload_input');
        userEvent.upload(input, file);
        await waitFor(() => {
            expect(input.files?.[0]).toBe(file);
            expect(input.files).toHaveLength(1);
        });

        const confirm_button = screen.getByRole('button', { name: 'Confirm' });
        expect(confirm_button).toBeInTheDocument();
        expect(confirm_button).toBeEnabled();
        userEvent.click(confirm_button);
        await waitFor(() => {
            expect(sendbird_store.sendFile).toHaveBeenCalled();
            expect(confirmOrderRequest).toHaveBeenCalledWith(order_information.id, true);
            expect(hideModal).toHaveBeenCalled();
        });
    });

    it('should call hideModal when clicking the close icon', () => {
        const { hideModal } = useModalManagerContext();

        render(<OrderDetailsConfirmModal />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        const close_icon = screen.getByTestId('dt_modal_close_icon');

        userEvent.click(close_icon);

        expect(hideModal).toHaveBeenCalled();
    });
});
