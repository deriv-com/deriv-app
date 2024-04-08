import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { APIProvider } from '@deriv/api';
import { P2PSettingsProvider } from '@deriv/stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { requestWS } from 'Utils/websocket';
import OrderDetailsCancelModal from '../order-details-cancel-modal';

const el_modal = document.createElement('div');

jest.mock('Utils/websocket', () => ({
    ...jest.requireActual('Utils/websocket'),
    requestWS: jest.fn().mockRejectedValue('Error'),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    useIsMounted: jest.fn().mockReturnValue(() => true),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <APIProvider>
        <P2PSettingsProvider>{children}</P2PSettingsProvider>
    </APIProvider>
);

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useP2PSettings: jest.fn().mockReturnValue({
        p2p_settings: {
            cancellation_block_duration: '17',
            cancellation_limit: '8',
            cancellation_count_period: '19',
        },
    }),
}));

const mock_store_values = {
    general_store: {
        advertiser_info: {
            cancels_remaining: 10,
        },
    },
    order_store: {
        order_information: {
            id: '10',
        },
        setErrorMessage: jest.fn(),
    },
};

jest.mock('@sendbird/chat', () => ({
    SendbirdChat: jest.fn().mockReturnValue({}),
}));

jest.mock('@sendbird/chat/groupChannel', () => ({
    SendbirdChat: jest.fn().mockReturnValue({}),
}));

jest.mock('@sendbird/chat/message', () => ({
    SendbirdChat: jest.fn().mockReturnValue({}),
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: () => mock_store_values,
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

    it('should render order details cancel modal in desktop ', () => {
        render(<OrderDetailsCancelModal />, { wrapper });

        expect(screen.getByText('Do you want to cancel this order?')).toBeInTheDocument();
    });

    it('should warn the user if the number of remaining cancels is equal to 1 ', () => {
        mock_store_values.general_store.advertiser_info.cancels_remaining = 1;

        render(<OrderDetailsCancelModal />, { wrapper });

        expect(
            screen.getByText("If you cancel this order, you'll be blocked from using Deriv P2P for 17 hours.")
        ).toBeInTheDocument();
    });

    it('should not cancel the order and hide the modal if Do not Cancel button is clicked', () => {
        const { hideModal } = useModalManagerContext();

        render(<OrderDetailsCancelModal />, { wrapper });
        userEvent.click(screen.getByRole('button', { name: 'Do not cancel' }));

        expect(hideModal).toHaveBeenCalled();
    });

    it('should cancel the order when Cancel this order button is clicked', () => {
        (requestWS as jest.Mock).mockResolvedValue({ message: 'Success' });
        render(<OrderDetailsCancelModal />, { wrapper });
        userEvent.click(screen.getByRole('button', { name: 'Cancel this order' }));

        expect(requestWS).toHaveBeenCalled();
    });

    it('should show error message when error response is received', async () => {
        const error_msg = 'Error';

        (requestWS as jest.Mock).mockResolvedValue({ error: { message: error_msg } });

        render(<OrderDetailsCancelModal />, { wrapper });
        userEvent.click(screen.getByRole('button', { name: 'Cancel this order' }));

        await waitFor(() => {
            expect(mock_store_values.order_store.setErrorMessage).toHaveBeenCalledWith(error_msg);
        });
    });
});
