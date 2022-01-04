import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import CryptoTransactionsHistory from '../crypto-transactions-history';
import CryptoTransactionsRenderer from '../crypto-transactions-renderer';
import CryptoTransactionsCancelModal from '../crypto-transactions-cancel-modal';
import CryptoTransactionsStatusModal from '../crypto-transactions-status-modal';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isMobile: jest.fn(),
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

describe('<CryptoTransactionsRenderer />', () => {
    let row;
    beforeEach(() => {
        row = {
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
        };
    });

    it('should show the proper data in Desktop mode', () => {
        render(<CryptoTransactionsRenderer row={row} currency={'BTC'} />);

        expect(screen.getByText('withdrawal')).toBeInTheDocument();
        expect(screen.getByText('Pending')).toBeInTheDocument();
        expect(screen.getByText('-0.00500000 BTC')).toBeInTheDocument();
        expect(screen.getByText('tb1q....ntxt')).toBeInTheDocument();
        expect(screen.getByText('In review')).toBeInTheDocument();
    });

    it('should show the proper data in Mobile mode', () => {
        isMobile.mockReturnValue(true);
        render(<CryptoTransactionsRenderer row={row} currency={'BTC'} />);

        expect(screen.getByText('withdrawal')).toBeInTheDocument();
        expect(screen.getByText('Pending')).toBeInTheDocument();
        expect(screen.getByText('-0.00500000 BTC')).toBeInTheDocument();
        expect(screen.getByText('tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt')).toBeInTheDocument();
        expect(screen.getByText('In review')).toBeInTheDocument();
        expect(screen.getByText('Cancel transaction')).toBeInTheDocument();
    });

    it('should trigger onClick callback when the user clicks "Cancel transaction" button in Mobile mode', () => {
        isMobile.mockReturnValue(true);
        const showCryptoTransactionsCancelModal = jest.fn();

        render(
            <CryptoTransactionsRenderer
                row={row}
                currency={'BTC'}
                showCryptoTransactionsCancelModal={showCryptoTransactionsCancelModal}
            />
        );

        let cancel_transaction_btn = screen.getByText('Cancel transaction');
        fireEvent.click(cancel_transaction_btn);
        expect(showCryptoTransactionsCancelModal).toHaveBeenCalledTimes(1);
    });
});

describe('<CryptoTransactionsCancelModal />', () => {
    beforeAll(() => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterEach(cleanup);

    it('should show "Are you sure you want to cancel this transaction" and "Cancel transaction" messages, "Yes" and "No" buttons', () => {
        render(<CryptoTransactionsCancelModal is_cancel_modal_visible />);

        expect(screen.getByText('Are you sure you want to cancel this transaction?')).toBeInTheDocument();
        expect(screen.getByText('Cancel transaction')).toBeInTheDocument();
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('should trigger onClick callback when the user clicks "Yes" button', () => {
        const cancelCryptoTransaction = jest.fn();

        render(
            <CryptoTransactionsCancelModal is_cancel_modal_visible cancelCryptoTransaction={cancelCryptoTransaction} />
        );
        const yes_btn = screen.getByText('Yes');
        fireEvent.click(yes_btn);

        expect(cancelCryptoTransaction).toHaveBeenCalledTimes(1);
    });

    it('should trigger onClick callback when the user clicks "No" button', () => {
        const hideCryptoTransactionsCancelModal = jest.fn();

        render(
            <CryptoTransactionsCancelModal
                is_cancel_modal_visible
                hideCryptoTransactionsCancelModal={hideCryptoTransactionsCancelModal}
            />
        );
        const no_btn = screen.getByText('No');
        fireEvent.click(no_btn);

        expect(hideCryptoTransactionsCancelModal).toHaveBeenCalledTimes(1);
    });
});

describe('<CryptoTransactionsStatusModal />', () => {
    beforeAll(() => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterEach(cleanup);

    it('should show proper messages and "OK" button', () => {
        render(
            <CryptoTransactionsStatusModal
                is_status_modal_visible
                selected_crypto_status={'Crypto transaction status'}
                selected_crypto_status_description={'Crypto transaction status description'}
            />
        );

        expect(screen.getByText('Crypto transaction status')).toBeInTheDocument();
        expect(screen.getByText('Crypto transaction status description')).toBeInTheDocument();
        expect(screen.getByText('OK')).toBeInTheDocument();
    });

    it('should trigger onClick callback when the user clicks "OK" button', () => {
        const hideCryptoTransactionsStatusModal = jest.fn();

        render(
            <CryptoTransactionsStatusModal
                is_status_modal_visible
                hideCryptoTransactionsStatusModal={hideCryptoTransactionsStatusModal}
            />
        );
        const ok_btn = screen.getByText('OK');
        fireEvent.click(ok_btn);

        expect(hideCryptoTransactionsStatusModal).toHaveBeenCalledTimes(1);
    });
});
