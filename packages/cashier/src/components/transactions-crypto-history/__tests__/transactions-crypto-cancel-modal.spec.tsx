import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TransactionsCryptoCancelModal from '../transactions-crypto-cancel-modal';
import CashierProviders from '../../../cashier-providers';
import { mockStore } from '@deriv/stores';

describe('<TransactionsCryptoCancelModal />', () => {
    let modal_root_el: HTMLDivElement, mockRootStore: ReturnType<typeof mockStore>;
    beforeEach(() => {
        mockRootStore = mockStore({
            modules: {
                cashier: {
                    transaction_history: {
                        cancelCryptoTransaction: jest.fn(),
                        hideTransactionsCryptoCancelModal: jest.fn(),
                        is_transactions_crypto_cancel_modal_visible: false,
                    },
                },
            },
        });
    });

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const renderTransactionsCryptoCancelModal = () =>
        render(<TransactionsCryptoCancelModal />, {
            wrapper: ({ children }) => <CashierProviders store={mockRootStore}>{children}</CashierProviders>,
        });

    it('should show "Are you sure you want to cancel this transaction" and "Cancel transaction" messages, "Yes" and "No" buttons', () => {
        mockRootStore.modules.cashier.transaction_history.is_transactions_crypto_cancel_modal_visible = true;

        renderTransactionsCryptoCancelModal();

        expect(screen.getByText('Are you sure you want to cancel this transaction?')).toBeInTheDocument();
        expect(screen.getByText('Cancel transaction')).toBeInTheDocument();
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('should trigger onClick callback when the user clicks "Yes" button', () => {
        mockRootStore.modules.cashier.transaction_history.is_transactions_crypto_cancel_modal_visible = true;

        renderTransactionsCryptoCancelModal();

        const yes_btn = screen.getByText('Yes');
        fireEvent.click(yes_btn);

        expect(mockRootStore.modules.cashier.transaction_history.cancelCryptoTransaction).toHaveBeenCalledTimes(1);
    });

    it('should trigger onClick callback when the user clicks "No" button', () => {
        mockRootStore.modules.cashier.transaction_history.is_transactions_crypto_cancel_modal_visible = true;

        renderTransactionsCryptoCancelModal();

        const no_btn = screen.getByText('No');
        fireEvent.click(no_btn);

        expect(
            mockRootStore.modules.cashier.transaction_history.hideTransactionsCryptoCancelModal
        ).toHaveBeenCalledTimes(1);
    });
});
