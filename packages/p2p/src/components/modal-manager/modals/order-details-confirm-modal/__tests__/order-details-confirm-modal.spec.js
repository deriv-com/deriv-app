import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useStores } from 'Stores';
import OrderDetailsConfirmModal from '../order-details-confirm-modal.jsx';

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
                account_currency: 'USD',
                amount: 10,
                amount_display: '20',
                id: 1,
                is_buy_order_for_user: false,
                local_currency: 'AED',
                other_user_details: { name: 'P2P' },
                rate: 2,
            },
        },
    }),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => ({
        hideModal: jest.fn(),
        is_modal_open: true,
    })),
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

        expect(screen.getByText('Have you received payment?')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Please confirm only after checking your bank or e-wallet account to make sure you have received payment.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText("I've received 20.00 AED")).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should render proper texts for buy order', () => {
        const { order_store } = useStores();
        const { order_information } = order_store;
        order_information.is_buy_order_for_user = true;

        render(<OrderDetailsConfirmModal />);

        expect(screen.getByText('Payment confirmation')).toBeInTheDocument();
        expect(screen.getByText('Have you paid 20.00 AED to P2P?')).toBeInTheDocument();
        expect(screen.getByText("Yes, I've paid")).toBeInTheDocument();
        expect(screen.getByText("I haven't paid yet")).toBeInTheDocument();
    });

    it('should enable the release button if user confirms receiving of amount', () => {
        const { order_store } = useStores();
        const { order_information } = order_store;
        order_information.is_buy_order_for_user = false;

        render(<OrderDetailsConfirmModal />);

        fireEvent.click(screen.getByRole('checkbox'));
        expect(screen.getByRole('button', { name: 'Release 20 USD' })).toBeEnabled();
    });

    it('should send a request when release button is clicked', async () => {
        const { order_store } = useStores();
        const { confirmOrderRequest, order_information } = order_store;

        render(<OrderDetailsConfirmModal />);

        fireEvent.click(screen.getByRole('checkbox'));
        fireEvent.click(screen.getByRole('button', { name: 'Release 20 USD' }));

        await waitFor(() => {
            expect(confirmOrderRequest).toHaveBeenCalledWith(
                order_information.id,
                order_information.is_buy_order_for_user
            );
        });
    });
});
