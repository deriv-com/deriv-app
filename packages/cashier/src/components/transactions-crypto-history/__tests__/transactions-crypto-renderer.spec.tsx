import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransactionsCryptoRenderer from '../transactions-crypto-renderer';
import CashierProviders from '../../../cashier-providers';
import { mockStore } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

describe('<TransactionsCryptoRenderer />', () => {
    let mockRootStore: ReturnType<typeof mockStore>;
    beforeEach(() => {
        mockRootStore = mockStore({
            modules: {
                cashier: {
                    transaction_history: {
                        cancelCryptoTransaction: jest.fn(),
                        showTransactionsCryptoCancelModal: jest.fn(),
                        showTransactionsCryptoStatusModal: jest.fn(),
                    },
                },
            },
            client: {
                currency: 'BTC',
            },
        });
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
            transaction_hash: '',
            transaction_type: 'withdrawal',
            transaction_url:
                'https://etherscan.io/tx/0x2aede798a325c96784c62073a5bd5e104a983fb47291a2d45992b40da636051e',
        },
        onTooltipClick: jest.fn(),
    } as const;

    const renderTransactionsCryptoRenderer = () =>
        render(<TransactionsCryptoRenderer {...props} />, {
            wrapper: ({ children }) => <CashierProviders store={mockRootStore}>{children}</CashierProviders>,
        });

    it('shows the proper data in Desktop mode', () => {
        renderTransactionsCryptoRenderer();

        expect(screen.getByText('Withdrawal')).toBeInTheDocument();
        expect(screen.getByText('Pending')).toBeInTheDocument();
        expect(screen.getByText('-0.00500000 BTC')).toBeInTheDocument();
        expect(screen.getByText('tb1q....ntxt')).toBeInTheDocument();
        expect(screen.getByText('In review')).toBeInTheDocument();
    });

    it('shows the proper data in Mobile/Tablet mode', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });

        renderTransactionsCryptoRenderer();

        expect(screen.getByText('Withdrawal')).toBeInTheDocument();
        expect(screen.getByText('Pending')).toBeInTheDocument();
        expect(screen.getByText('-0.00500000 BTC')).toBeInTheDocument();
        expect(screen.getByText('tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt')).toBeInTheDocument();
        expect(screen.getByText('In review')).toBeInTheDocument();
        expect(screen.getByText('Cancel transaction')).toBeInTheDocument();
    });

    it('shows proper message with "Yes" and "No" buttons when user clicks on cross-button in Desktop mode', () => {
        renderTransactionsCryptoRenderer();

        const cancel_transaction_div = screen.getByTestId('dt_transactions_crypto_history_table_button');
        fireEvent.click(cancel_transaction_div);

        expect(screen.getByText('Are you sure you want to cancel this transaction?')).toBeInTheDocument();
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('shows cancel confirmation modal when user clicks on "Cancel transaction" button in Mobile/Tablet mode', async () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });

        renderTransactionsCryptoRenderer();

        const cancel_transaction_btn = screen.getByTestId('dt_cancel_transaction');
        fireEvent.click(cancel_transaction_btn);

        expect(
            mockRootStore.modules.cashier.transaction_history.showTransactionsCryptoCancelModal
        ).toHaveBeenCalledTimes(1);
    });

    it('closes modal when "No" button is clicked', async () => {
        renderTransactionsCryptoRenderer();

        const cancel_transaction_div = screen.getByTestId('dt_transactions_crypto_history_table_button');
        fireEvent.click(cancel_transaction_div);
        const no_btn = screen.getByText('No');
        fireEvent.click(no_btn);

        await waitFor(() => {
            expect(screen.queryByText('Are you sure you want to cancel this transaction?')).not.toBeInTheDocument();
            expect(screen.queryByText('Yes')).not.toBeInTheDocument();
            expect(screen.queryByText('No')).not.toBeInTheDocument();
        });
    });

    it('closes modal when "Yes" button is clicked', async () => {
        renderTransactionsCryptoRenderer();

        const cancel_transaction_div = screen.getByTestId('dt_transactions_crypto_history_table_button');
        fireEvent.click(cancel_transaction_div);
        const yes_btn = screen.getByText('Yes');
        fireEvent.click(yes_btn);

        await waitFor(() => {
            expect(screen.queryByText('Are you sure you want to cancel this transaction?')).not.toBeInTheDocument();
            expect(screen.queryByText('Yes')).not.toBeInTheDocument();
            expect(screen.queryByText('No')).not.toBeInTheDocument();
        });
    });

    it('displays popover when hovering on tooltip for third-party transactions (CoinsPaid) in Desktop mode', () => {
        const tooltip_props = {
            row: {
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
                transaction_url: 'CP:Abcd1234',
            },
            onTooltipClick: jest.fn(),
        } as const;

        render(<TransactionsCryptoRenderer {...tooltip_props} />, {
            wrapper: ({ children }) => <CashierProviders store={mockRootStore}>{children}</CashierProviders>,
        });

        const transactions_crypto_history_table_tooltip = screen.getByTestId(
            'dt_transactions_crypto_history_table_tooltip'
        );

        expect(transactions_crypto_history_table_tooltip).toBeInTheDocument();

        userEvent.hover(transactions_crypto_history_table_tooltip);
        expect(screen.getByText('The details of this transaction is available on CoinsPaid.')).toBeInTheDocument();
        userEvent.unhover(transactions_crypto_history_table_tooltip);
    });

    it('checks whether the tooltip is clickable for third-party transactions (CoinsPaid) in Mobile/Tablet mode', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });

        const tooltip_props = {
            row: {
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
                transaction_url: 'CP:Abcd1234',
            },
            onTooltipClick: jest.fn(),
        } as const;

        render(<TransactionsCryptoRenderer {...tooltip_props} />, {
            wrapper: ({ children }) => <CashierProviders store={mockRootStore}>{children}</CashierProviders>,
        });

        const transactions_crypto_history_table_tooltip_mobile = screen.getByTestId(
            'dt_transactions_crypto_history_table_tooltip_mobile'
        );

        expect(transactions_crypto_history_table_tooltip_mobile).toBeInTheDocument();
        fireEvent.click(transactions_crypto_history_table_tooltip_mobile);
    });

    it('shows transaction status modal when status is clicked in Mobile/Tablet mode', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });

        renderTransactionsCryptoRenderer();

        const table_status = screen.getByTestId('dt_table_status');
        fireEvent.click(table_status);

        expect(
            mockRootStore.modules.cashier.transaction_history.showTransactionsCryptoStatusModal
        ).toHaveBeenCalledTimes(1);
    });
});
