import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import RecentTransaction from '../recent-transaction';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<RecentTransaction />', () => {
    const props = {
        crypto_transactions: [
            {
                address_hash: 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
                address_url:
                    'https://www.blockchain.com/btc-testnet/address/tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
                amount: 0.01,
                id: '262',
                is_valid_to_cancel: 1,
                status_code: 'LOCKED',
                status_message:
                    "We're reviewing your withdrawal request. You may still cancel this transaction if you wish. Once we start processing, you won't be able to cancel.",
                submit_date: 1644408421,
                transaction_type: 'withdrawal',
            },
        ],
        currency: 'BTC',
        onMount: jest.fn(),
        setIsCryptoTransactionsVisible: jest.fn(),
    };

    let history;
    const renderWithRouter = component => {
        history = createBrowserHistory();
        return render(<Router history={history}>{component}</Router>);
    };

    it('should show proper messages', () => {
        renderWithRouter(<RecentTransaction {...props} />);

        expect(screen.getByText('Recent transactions')).toBeInTheDocument();
        expect(screen.getByText('Withdrawal BTC')).toBeInTheDocument();
        expect(screen.getByText('In review')).toBeInTheDocument();
        expect(screen.getByText('0.01 BTC on Feb 9, 2022')).toBeInTheDocument();
        expect(screen.getByText('Address:')).toBeInTheDocument();
        expect(screen.getByText('tb1q....ntxt')).toBeInTheDocument();
        expect(screen.getByText('Transaction hash:')).toBeInTheDocument();
        expect(screen.getByText('Pending')).toBeInTheDocument();
        expect(screen.getByText('View all')).toBeInTheDocument();
    });

    it('should trigger onClick callback when the user clicks on "View all" button', () => {
        renderWithRouter(<RecentTransaction {...props} />);

        const view_all_btn_link = screen.getByRole('link', { name: 'View all' });
        fireEvent.click(view_all_btn_link);

        expect(props.setIsCryptoTransactionsVisible).toHaveBeenCalledTimes(1);
    });

    it('should show the proper icon when transaction_type is equal to "withdrawal"', () => {
        renderWithRouter(<RecentTransaction {...props} />);

        expect(screen.getByTestId('dti_icon_cashier_minus')).toBeInTheDocument();
    });

    it('should show the proper icon when transaction_type is equal to "deposit"', () => {
        renderWithRouter(
            <RecentTransaction
                {...props}
                crypto_transactions={[
                    { ...props.crypto_transactions[0], transaction_type: 'deposit', status_code: 'PENDING' },
                ]}
            />
        );

        expect(screen.getByTestId('dti_icon_cashier_add')).toBeInTheDocument();
    });

    it('should not show "Recent transactions" title if crypto_transactions is an empty array', () => {
        renderWithRouter(<RecentTransaction {...props} crypto_transactions={[]} />);

        expect(screen.queryByText('Recent transactions')).not.toBeInTheDocument();
    });
});
