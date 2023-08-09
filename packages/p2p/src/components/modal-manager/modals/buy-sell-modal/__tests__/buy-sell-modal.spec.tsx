import React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import BuySellModal from '../buy-sell-modal';

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

const mock_modal_manager: DeepPartial<ReturnType<typeof useModalManagerContext>> = {
    is_modal_open: true,
};

const el_modal = document.createElement('div');

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        search: '',
    }),
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

jest.mock('Pages/buy-sell/buy-sell-form.jsx', () => jest.fn(() => <div>BuySellForm</div>));
jest.mock('Pages/buy-sell/buy-sell-form-receive-amount.jsx', () => jest.fn(() => <div>BuySellFormReceiveAmount</div>));
jest.mock('../buy-sell-modal-error', () => jest.fn(() => <div>BuySellModalError</div>));

describe('<BuySellModal />', () => {
    beforeEach(() => {
        mock_store = {
            advertiser_page_store: {
                setFormErrorMessage: jest.fn(),
            },
            buy_sell_store: {
                selected_ad_state: {
                    account_currency: 'USD',
                },
                table_type: 'buy',
                onCancelBuySellOrder: jest.fn(),
            },
            general_store: {
                balance: 10000,
                is_form_modified: false,
                hideModal: jest.fn(),
                setHistory: jest.fn(),
                setLocation: jest.fn(),
            },
            my_profile_store: {
                should_show_add_payment_method_form: false,
            },
        };
    });

    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render the BuySellModal', () => {
        render(<BuySellModal />);

        expect(screen.getByText('Buy USD')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });

    it('should set is_modal_open to false when clicking cancel', async () => {
        render(<BuySellModal />);

        const cancel_button = screen.getByRole('button', { name: 'Cancel' });
        userEvent.click(cancel_button);

        await waitFor(() => {
            expect(mock_store.buy_sell_store.onCancelBuySellOrder).toHaveBeenCalled();
        });
    });

    it('should setErrorMessage to empty string if is_modal_open is false', () => {
        const mockSetErrorMessage = jest.spyOn(React, 'useState');
        (mockSetErrorMessage as jest.Mock).mockImplementation(initial_value => [initial_value, jest.fn()]);

        mock_modal_manager.is_modal_open = false;

        render(<BuySellModal />);

        expect(mockSetErrorMessage).toHaveBeenCalledWith('');
    });
});
