import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import CryptoTransactionsRenderer from '../crypto-transactions-renderer';

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
