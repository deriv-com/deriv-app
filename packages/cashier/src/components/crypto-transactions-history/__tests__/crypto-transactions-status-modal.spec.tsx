import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CryptoTransactionsStatusModal from '../crypto-transactions-status-modal';
import CashierProviders from '../../../cashier-providers';

describe('<CryptoTransactionsStatusModal />', () => {
    let modal_root_el, mockRootStore;
    beforeEach(() => {
        mockRootStore = {
            modules: {
                cashier: {
                    transaction_history: {
                        hideCryptoTransactionsStatusModal: jest.fn(),
                        is_crypto_transactions_status_modal_visible: true,
                        selected_crypto_status: 'Crypto transaction status',
                        selected_crypto_status_description: 'Crypto transaction status description',
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

    const renderCryptoTransactionsStatusModal = () =>
        render(<CryptoTransactionsStatusModal />, {
            wrapper: ({ children }) => <CashierProviders store={mockRootStore}>{children}</CashierProviders>,
        });

    it('should show proper messages and "OK" button', () => {
        renderCryptoTransactionsStatusModal();

        expect(screen.getByText('Crypto transaction status')).toBeInTheDocument();
        expect(screen.getByText('Crypto transaction status description')).toBeInTheDocument();
        expect(screen.getByText('OK')).toBeInTheDocument();
    });

    it('should trigger onClick callback when the user clicks "OK" button', () => {
        renderCryptoTransactionsStatusModal();

        const ok_btn = screen.getByText('OK');
        fireEvent.click(ok_btn);

        expect(
            mockRootStore.modules.cashier.transaction_history.hideCryptoTransactionsStatusModal
        ).toHaveBeenCalledTimes(1);
    });
});
