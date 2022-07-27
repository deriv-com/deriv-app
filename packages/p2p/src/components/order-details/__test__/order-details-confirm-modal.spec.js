import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { requestWS } from 'Utils/websocket';
import OrderDetailsConfirmModal from '../order-details-confirm-modal.jsx';

const el_modal = document.createElement('div');

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    useIsMounted: jest.fn().mockReturnValue(() => true),
}));

jest.mock('Utils/websocket', () => ({
    ...jest.requireActual('Utils/websocket'),
    requestWS: jest.fn().mockResolvedValue({ error: { message: 'P2P Error' } }),
}));

describe('<OrderDetailsConfirmModal/>', () => {
    const mock_props = {
        amount: 10,
        account_currency: 'USD',
        amount_display: '20',
        id: 1,
        local_currency: 'AED',
        other_user_details: { name: 'P2P' },
        rate: 2,
    };
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });
    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render the confirm modal in desktop', () => {
        render(<OrderDetailsConfirmModal should_show_confirm_modal order_information={mock_props} />);

        expect(screen.getByText('Have you received payment?')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Please confirm only after checking your bank or e-wallet account to make sure you have received payment.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText("I've received 20.00 AED")).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should render different texts when is_buy_order_for_user is enabled', () => {
        render(
            <OrderDetailsConfirmModal should_show_confirm_modal is_buy_order_for_user order_information={mock_props} />
        );

        expect(screen.getByText('Payment confirmation')).toBeInTheDocument();
        expect(screen.getByText('Have you paid 20.00 AED to P2P?')).toBeInTheDocument();
        expect(screen.getByText("Yes, I've paid")).toBeInTheDocument();
        expect(screen.getByText("I haven't paid yet")).toBeInTheDocument();
    });

    it('should enable checkbox when clicked', () => {
        render(<OrderDetailsConfirmModal should_show_confirm_modal order_information={mock_props} />);

        fireEvent.click(screen.getByRole('checkbox'));
        expect(screen.getByRole('checkbox')).toBeChecked();

        fireEvent.click(screen.getByRole('checkbox'));
        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('should disable the button if checkbox is unchecked', () => {
        render(<OrderDetailsConfirmModal should_show_confirm_modal order_information={mock_props} />);

        expect(screen.getByRole('button', { name: 'Release 20 USD' })).toBeDisabled();
    });

    it('should send a request when Release 20 USD is clicked', async () => {
        render(<OrderDetailsConfirmModal should_show_confirm_modal order_information={mock_props} />);
        fireEvent.click(screen.getByRole('checkbox'));
        act(() => {
            fireEvent.click(screen.getByRole('button', { name: 'Release 20 USD' }));
        });

        await waitFor(() => {
            expect(requestWS).toHaveBeenCalled();
        });
    });
});
