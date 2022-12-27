import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CryptoTransactionsCancelModal from '../crypto-transactions-cancel-modal';
import { StoreProvider } from '@deriv/stores';

describe('<CryptoTransactionsCancelModal />', () => {
    let modal_root_el, mockRootStore;
    beforeEach(() => {
        mockRootStore = {
            modules: {
                cashier: {
                    transaction_history: {
                        cancelCryptoTransaction: jest.fn(),
                        hideCryptoTransactionsCancelModal: jest.fn(),
                        is_crypto_transactions_cancel_modal_visible: false,
                    },
                },
            },
        };
    });

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const renderCryptoTransactionsCancelModal = () =>
        render(<CryptoTransactionsCancelModal />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

    it('should show "Are you sure you want to cancel this transaction" and "Cancel transaction" messages, "Yes" and "No" buttons', () => {
        mockRootStore.modules.cashier.transaction_history.is_crypto_transactions_cancel_modal_visible = true;

        renderCryptoTransactionsCancelModal();

        expect(screen.getByText('Are you sure you want to cancel this transaction?')).toBeInTheDocument();
        expect(screen.getByText('Cancel transaction')).toBeInTheDocument();
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('should trigger onClick callback when the user clicks "Yes" button', () => {
        mockRootStore.modules.cashier.transaction_history.is_crypto_transactions_cancel_modal_visible = true;

        renderCryptoTransactionsCancelModal();

        const yes_btn = screen.getByText('Yes');
        fireEvent.click(yes_btn);

        expect(mockRootStore.modules.cashier.transaction_history.cancelCryptoTransaction).toHaveBeenCalledTimes(1);
    });

    it('should trigger onClick callback when the user clicks "No" button', () => {
        mockRootStore.modules.cashier.transaction_history.is_crypto_transactions_cancel_modal_visible = true;

        renderCryptoTransactionsCancelModal();

        const yes_btn = screen.getByText('Yes');
        const no_btn = screen.getByText('No');
        fireEvent.click(no_btn);

        expect(
            mockRootStore.modules.cashier.transaction_history.hideCryptoTransactionsCancelModal
        ).toHaveBeenCalledTimes(1);
    });
});
