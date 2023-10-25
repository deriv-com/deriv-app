import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TransactionsCryptoStatusModal from '../transactions-crypto-status-modal';
import CashierProviders from '../../../cashier-providers';
import { mockStore } from '@deriv/stores';

describe('<TransactionsCryptoStatusModal />', () => {
    let modal_root_el: HTMLDivElement, mockRootStore: ReturnType<typeof mockStore>;
    beforeEach(() => {
        mockRootStore = mockStore({
            modules: {
                cashier: {
                    transaction_history: {
                        hideTransactionsCryptoStatusModal: jest.fn(),
                        is_transactions_crypto_status_modal_visible: true,
                        selected_crypto_status: 'Crypto transaction status',
                        selected_crypto_status_description: 'Crypto transaction status description',
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

    const renderTransactionsCryptoStatusModal = () =>
        render(<TransactionsCryptoStatusModal />, {
            wrapper: ({ children }) => <CashierProviders store={mockRootStore}>{children}</CashierProviders>,
        });

    it('should show proper messages and "OK" button', () => {
        renderTransactionsCryptoStatusModal();

        expect(screen.getByText('Crypto transaction status')).toBeInTheDocument();
        expect(screen.getByText('Crypto transaction status description')).toBeInTheDocument();
        expect(screen.getByText('OK')).toBeInTheDocument();
    });

    it('should trigger onClick callback when the user clicks "OK" button', () => {
        renderTransactionsCryptoStatusModal();

        const ok_btn = screen.getByText('OK');
        fireEvent.click(ok_btn);

        expect(
            mockRootStore.modules.cashier.transaction_history.hideTransactionsCryptoStatusModal
        ).toHaveBeenCalledTimes(1);
    });
});
