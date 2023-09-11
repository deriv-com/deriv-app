import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CryptoTransactionsHistory from '../crypto-transactions-history';
import CashierProviders from '../../../cashier-providers';
import { mockStore } from '@deriv/stores';
import { useSubscription } from '@deriv/api';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useSubscription: jest.fn(),
}));

const mockUseSubscription = useSubscription as jest.MockedFunction<typeof useSubscription<'cashier_payments'>>;

describe('<CryptoTransactionsHistory />', () => {
    let mockRootStore: ReturnType<typeof mockStore>;

    beforeEach(() => {
        mockRootStore = mockStore({
            modules: {
                cashier: {
                    transaction_history: {
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
        });
    });

    const renderCryptoTransactionsHistory = () =>
        render(<CryptoTransactionsHistory />, {
            wrapper: ({ children }) => <CashierProviders store={mockRootStore}>{children}</CashierProviders>,
        });

    it('should show "USD recent transactions" and "No current transactions available" messages', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useSubscription
        mockUseSubscription.mockReturnValue({ subscribe: jest.fn() });

        renderCryptoTransactionsHistory();

        expect(screen.getByText('BTC recent transactions')).toBeInTheDocument();
        expect(screen.getByText('No current transactions available')).toBeInTheDocument();
    });

    it('should trigger onClick callback when the back arrow is clicked', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useSubscription
        mockUseSubscription.mockReturnValue({ subscribe: jest.fn() });

        renderCryptoTransactionsHistory();

        const back_arrow = screen.getByTestId('dt_crypto_transactions_history_back');
        fireEvent.click(back_arrow);

        expect(mockRootStore.modules.cashier.transaction_history.setIsCryptoTransactionsVisible).toHaveBeenCalledTimes(
            1
        );
    });

    it('should show the loader when is_loading is equal "true"', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useSubscription
        mockUseSubscription.mockReturnValue({
            data: {
                cashier_payments: {
                    crypto: [
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
                    ],
                },
            },
            is_loading: true,
            subscribe: jest.fn(),
        });

        renderCryptoTransactionsHistory();

        const loader = screen.getByTestId('dt_initial_loader');
        expect(loader).toBeInTheDocument();
    });

    it('should show table headers: "Transaction", "Amount", "Address", "Transaction hash", "Time", "Status", "Action"', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useSubscription
        mockUseSubscription.mockReturnValue({
            data: {
                cashier_payments: {
                    crypto: [
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
                    ],
                },
            },
            subscribe: jest.fn(),
        });

        const headers = ['Transaction', 'Amount', 'Address', 'Transaction hash', 'Time', 'Status', 'Action'];

        renderCryptoTransactionsHistory();

        headers.forEach(el => {
            expect(screen.getByText(el)).toBeInTheDocument();
        });
    });
});
