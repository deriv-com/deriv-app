import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CryptoWithdrawReceipt from '../crypto-withdraw-receipt';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<CryptoWithdrawReceipt />', () => {
    const mockProps = () => ({
        account: {
            balance: '1.00000000',
            currency: 'BTC',
            is_crypto: true,
            is_dxtrade: false,
            is_mt: false,
            text: 'BTC',
            value: 'CR90000118',
        },
        blockchain_address: 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
        withdraw_amount: 0.0002,
        currency: 'BTC',
        recentTransactionOnMount: jest.fn(),
        setIsWithdrawConfirmed: jest.fn(),
        resetWithrawForm: jest.fn(),
        setIsCryptoTransactionsVisible: jest.fn(),
    });

    it('should show the proper text/messages', () => {
        const props = mockProps();
        render(<CryptoWithdrawReceipt {...props} />);

        expect(screen.getByText('Your withdrawal will be processed within 24 hours')).toBeInTheDocument();
        expect(screen.getByText('In review')).toBeInTheDocument();
        expect(screen.getByText('0.0002 BTC')).toBeInTheDocument();
        expect(screen.getByText('BTC')).toBeInTheDocument();
        expect(screen.getByText('CR90000118')).toBeInTheDocument();
        expect(screen.getByText('BTC wallet')).toBeInTheDocument();
        expect(screen.getByText('tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt')).toBeInTheDocument();
        expect(screen.getByText('View transaction history')).toBeInTheDocument();
        expect(screen.getByText('Make a new withdrawal')).toBeInTheDocument();
    });

    it('should trigger onClick callback when the "View transaction history" button is clicked', () => {
        const props = mockProps();
        render(<CryptoWithdrawReceipt {...props} />);

        const view_transaction_history_btn = screen.getByText('View transaction history');
        fireEvent.click(view_transaction_history_btn);
        expect(props.setIsCryptoTransactionsVisible).toHaveBeenCalledTimes(1);
    });

    it('should trigger onClick callback when the "Make a new withdrawal" button is clicked', () => {
        const props = mockProps();
        render(<CryptoWithdrawReceipt {...props} />);

        const make_new_withdrawal_btn = screen.getByText('Make a new withdrawal');
        fireEvent.click(make_new_withdrawal_btn);
        expect(props.setIsWithdrawConfirmed).toHaveBeenCalledTimes(1);
    });
});
