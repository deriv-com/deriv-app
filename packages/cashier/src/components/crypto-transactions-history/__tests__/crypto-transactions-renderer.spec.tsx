import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import CryptoTransactionsRenderer from '../crypto-transactions-renderer';
import { StoreProvider } from '@deriv/stores';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isMobile: jest.fn(),
}));

describe('<CryptoTransactionsRenderer />', () => {
    let mockRootStore;
    beforeEach(() => {
        mockRootStore = {
            modules: {
                cashier: {
                    transaction_history: {
                        cancelCryptoTransaction: jest.fn(),
                        showCryptoTransactionsCancelModal: jest.fn(),
                        showCryptoTransactionsStatusModal: jest.fn(),
                    },
                },
            },
            client: {
                currency: 'BTC',
            },
        };
    });
    const props = {
        row: {
            address_hash: 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
            address_url: 'https://www.blockchain.com/btc-testnet/address/tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
            amount: 0.005,
            id: '3',
            is_valid_to_cancel: 1,
            status_code: 'LOCKED',
            status_message:
                "We're reviewing your withdrawal request. You may still cancel this transaction if you wish. Once we start processing, you won't be able to cancel.",
            submit_date: 1640603927,
            transaction_type: 'withdrawal',
        },
    };

    const renderCryptoTransactionsRenderer = () =>
        render(<CryptoTransactionsRenderer {...props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

    it('should show the proper data in Desktop mode', () => {
        renderCryptoTransactionsRenderer();

        expect(screen.getByText('withdrawal')).toBeInTheDocument();
        expect(screen.getByText('Pending')).toBeInTheDocument();
        expect(screen.getByText('-0.00500000 BTC')).toBeInTheDocument();
        expect(screen.getByText('tb1q....ntxt')).toBeInTheDocument();
        expect(screen.getByText('In review')).toBeInTheDocument();
    });

    it('should show the popover with the proper message, "Yes" and "No" buttons if the "Cancel transaction" cross-button was clicked in Desktop mode', () => {
        renderCryptoTransactionsRenderer();

        const cancel_transaction_div = screen.getByTestId('dt_crypto_transactions_history_table_button');
        fireEvent.click(cancel_transaction_div);

        expect(screen.getByText('Are you sure you want to cancel this transaction?')).toBeInTheDocument();
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('should close the popover when "No" button is clicked in Desktop mode', async () => {
        renderCryptoTransactionsRenderer();

        const cancel_transaction_div = screen.getByTestId('dt_crypto_transactions_history_table_button');
        fireEvent.click(cancel_transaction_div);
        const no_btn = screen.getByText('No');
        fireEvent.click(no_btn);

        await waitFor(() => {
            expect(screen.queryByText('Are you sure you want to cancel this transaction?')).not.toBeInTheDocument();
            expect(screen.queryByText('Yes')).not.toBeInTheDocument();
            expect(screen.queryByText('No')).not.toBeInTheDocument();
        });
    });

    it('should close the popover when "Yes" button is clicked in Desktop mode', async () => {
        renderCryptoTransactionsRenderer();

        const cancel_transaction_div = screen.getByTestId('dt_crypto_transactions_history_table_button');
        fireEvent.click(cancel_transaction_div);
        const yes_btn = screen.getByText('Yes');
        fireEvent.click(yes_btn);

        await waitFor(() => {
            expect(screen.queryByText('Are you sure you want to cancel this transaction?')).not.toBeInTheDocument();
            expect(screen.queryByText('Yes')).not.toBeInTheDocument();
            expect(screen.queryByText('No')).not.toBeInTheDocument();
        });
    });

    it('should trigger onClick callback when "crypto-transactions-history__table-status" is clicked in Mobile mode', () => {
        (isMobile as jest.Mock).mockReturnValue(true);

        renderCryptoTransactionsRenderer();

        const table_status = screen.getByTestId('dt_table_status');
        fireEvent.click(table_status);

        expect(
            mockRootStore.modules.cashier.transaction_history.showCryptoTransactionsStatusModal
        ).toHaveBeenCalledTimes(1);
    });

    it('should show the proper data in Mobile mode', () => {
        (isMobile as jest.Mock).mockReturnValue(true);

        renderCryptoTransactionsRenderer();

        expect(screen.getByText('withdrawal')).toBeInTheDocument();
        expect(screen.getByText('Pending')).toBeInTheDocument();
        expect(screen.getByText('-0.00500000 BTC')).toBeInTheDocument();
        expect(screen.getByText('tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt')).toBeInTheDocument();
        expect(screen.getByText('In review')).toBeInTheDocument();
        expect(screen.getByText('Cancel transaction')).toBeInTheDocument();
    });

    it('should trigger onClick callback when the user clicks "Cancel transaction" button in Mobile mode', () => {
        (isMobile as jest.Mock).mockReturnValue(true);

        renderCryptoTransactionsRenderer();

        const cancel_transaction_btn = screen.getByTestId('dt_cancel_transaction');
        fireEvent.click(cancel_transaction_btn);
        expect(
            mockRootStore.modules.cashier.transaction_history.showCryptoTransactionsCancelModal
        ).toHaveBeenCalledTimes(1);
    });
});
