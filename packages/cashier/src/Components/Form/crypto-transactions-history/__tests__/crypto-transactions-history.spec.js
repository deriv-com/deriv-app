import React from 'react';
import { render, screen } from '@testing-library/react';
import CryptoTransactionsHistory from '../crypto-transactions-history';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<CryptoTransactionsHistory />', () => {
    it('should show "USD recent transactions" and "No current transactions available" messages', () => {
        const setIsCryptoTransactionsVisible = jest.fn();
        render(
            <CryptoTransactionsHistory
                crypto_transactions={[]}
                currency={'BTC'}
                setIsCryptoTransactionsVisible={setIsCryptoTransactionsVisible}
            />
        );

        expect(screen.getByText('BTC recent transactions')).toBeInTheDocument();
        expect(screen.getByText('No current transactions available')).toBeInTheDocument();
    });

    it('should show table headers: "Transaction", "Amount", "Address", "Transaction hash", "Time", "Status", "Action"', () => {
        const setIsCryptoTransactionsVisible = jest.fn();
        const crypto_transactions = [
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

        render(
            <CryptoTransactionsHistory
                crypto_transactions={crypto_transactions}
                currency={'BTC'}
                setIsCryptoTransactionsVisible={setIsCryptoTransactionsVisible}
            />
        );

        headers.forEach(el => {
            expect(screen.getByText(el)).toBeInTheDocument();
        });
    });
});
