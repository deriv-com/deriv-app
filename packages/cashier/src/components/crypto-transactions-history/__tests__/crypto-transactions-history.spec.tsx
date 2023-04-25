import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// import { isMobile } from '@deriv/shared';
import CryptoTransactionsHistory from '../crypto-transactions-history';
import CryptoTransactionsRenderer from '../crypto-transactions-renderer';
import CashierProviders from '../../../cashier-providers';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: () => true,
}));

describe('<CryptoTransactionsHistory />', () => {
    let mockRootStore;

    beforeEach(() => {
        mockRootStore = {
            modules: {
                cashier: {
                    transaction_history: {
                        crypto_transactions: [],
                        is_loading: false,
                        setIsCryptoTransactionsVisible: jest.fn(),
                    },
                    general_store: {
                        setIsDeposit: jest.fn(),
                    },
                },
            },
            client: {
                currency: 'BTC',
            },
        };
    });

    const renderCryptoTransactionsHistory = () =>
        render(<CryptoTransactionsHistory />, {
            wrapper: ({ children }) => <CashierProviders store={mockRootStore}>{children}</CashierProviders>,
        });

    it('should show "USD recent transactions" and "No current transactions available" messages', () => {
        renderCryptoTransactionsHistory();

        expect(screen.getByText('BTC recent transactions')).toBeInTheDocument();
        expect(screen.getByText('No current transactions available')).toBeInTheDocument();
    });

    it('should trigger onClick callback when the back arrow is clicked', () => {
        renderCryptoTransactionsHistory();

        const back_arrow = screen.getByTestId('dt_crypto_transactions_history_back');
        fireEvent.click(back_arrow);

        expect(mockRootStore.modules.cashier.transaction_history.setIsCryptoTransactionsVisible).toHaveBeenCalledTimes(
            1
        );
    });

    it('should show the loader when is_loading is equal "true"', () => {
        mockRootStore.modules.cashier.transaction_history.crypto_transactions = [
            {
                address_hash: 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
                address_url:
                    'https://www.blockchain.com/btc-testnet/address/tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
                amount: 0.005,
                id: '3',
                is_valid_to_cancel: 1,
                status_code: 'LOCKED',
                status_message:
                    "We're reviewing your withdrawal request. You may still cancel this transaction if you wish. Once we start processing, you won't be able to cancel.",
                submit_date: 1640603927,
                transaction_type: 'withdrawal',
            },
        ];
        mockRootStore.modules.cashier.transaction_history.is_loading = true;

        renderCryptoTransactionsHistory();

        const loader = screen.getByTestId('dt_initial_loader');
        expect(loader).toBeInTheDocument();
    });

    it('should show table headers: "Transaction", "Amount", "Address", "Transaction hash", "Time", "Status", "Action"', () => {
        mockRootStore.modules.cashier.transaction_history.crypto_transactions = [
            {
                address_hash: 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
                address_url:
                    'https://www.blockchain.com/btc-testnet/address/tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
                amount: 0.005,
                id: '3',
                is_valid_to_cancel: 1,
                status_code: 'LOCKED',
                status_message:
                    "We're reviewing your withdrawal request. You may still cancel this transaction if you wish. Once we start processing, you won't be able to cancel.",
                submit_date: 1640603927,
                transaction_type: 'withdrawal',
            },
        ];
        const headers = ['Transaction', 'Amount', 'Address', 'Transaction hash', 'Time', 'Status', 'Action'];

        renderCryptoTransactionsHistory();

        headers.forEach(el => {
            expect(screen.getByText(el)).toBeInTheDocument();
        });
    });

    fit('should check whether the popup appears when tooltip for transaction hash is clicked in mobile mode', () => {
        // (isMobile as jest.Mock).mockReturnValue(true);
        // const setIsModalVisible = jest.fn();
        // jest.spyOn(React, 'useState').mockImplementationOnce(() => React.useState(true));

        mockRootStore.modules.cashier.transaction_history.crypto_transactions = [
            {
                address_hash: 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
                address_url: 'https://explorer.coinspaid.com/CP:Abcd1234',
                amount: 0.005,
                id: '3',
                is_valid_to_cancel: 1,
                status_code: 'LOCKED',
                status_message:
                    "We're reviewing your withdrawal request. You may still cancel this transaction if you wish. Once we start processing, you won't be able to cancel.",
                submit_date: 1640603927,
                transaction_type: 'withdrawal',
                transaction_url: 'https://explorer.coinspaid.com/CP:Abcd1234',
                transaction_hash: 'CP:Abcd1234',
            },
        ];
        mockRootStore.modules.cashier.transaction_history.is_loading = false;

        // const props = {
        //     row: {
        //         address_hash: 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
        //         address_url: 'https://explorer.coinspaid.com/CP:Abcd1234',
        //         amount: 0.005,
        //         id: '3',
        //         is_valid_to_cancel: 1,
        //         status_code: 'LOCKED',
        //         status_message:
        //             "We're reviewing your withdrawal request. You may still cancel this transaction if you wish. Once we start processing, you won't be able to cancel.",
        //         submit_date: 1640603927,
        //         transaction_type: 'withdrawal',
        //         transaction_url: 'https://explorer.coinspaid.com/CP:Abcd1234',
        //         transaction_hash: 'CP:Abcd1234',
        //     },
        // };

        render(<CryptoTransactionsHistory />, {
            wrapper: ({ children }) => <CashierProviders store={mockRootStore}>{children}</CashierProviders>,
        });
        // render(<CryptoTransactionsRenderer {...props} onTooltipClick={() => setIsModalVisible(true)} />, {
        //     wrapper: ({ children }) => <CashierProviders store={mockRootStore}>{children}</CashierProviders>,
        // });

        // screen.debug();

        waitFor(() => screen.getByTestId('dt_crypto_transactions_history_table_tooltip_mobile'));

        const crypto_transactions_history_table_tooltip_mobile = screen.getByTestId(
            'dt_crypto_transactions_history_table_tooltip_mobile'
        );

        expect(crypto_transactions_history_table_tooltip_mobile).toBeInTheDocument();
        fireEvent.click(crypto_transactions_history_table_tooltip_mobile);

        waitFor(() =>
            expect(screen.getByText('The details of this transaction is available on CoinsPaid.')).toBeInTheDocument()
        );
        // screen.debug();
        // expect(screen.getByText('The details of this transaction is available on CoinsPaid.')).toBeInTheDocument();
        // expect(screen.getByText('Note')).toBeInTheDocument();
    });
});
