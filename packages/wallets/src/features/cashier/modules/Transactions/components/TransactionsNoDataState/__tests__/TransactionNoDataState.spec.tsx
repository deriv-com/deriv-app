import React from 'react';
import { useHistory } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import TransactionsNoDataState from '../TransactionsNoDataState';

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
}));
const mockUseHistory = useHistory as jest.Mock;

describe('TransactionsNoDataState', () => {
    test('should render contents of component correctly', () => {
        render(<TransactionsNoDataState />);

        expect(screen.getByText('No recent transactions')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Make a deposit or transfer funds from your existing trading account(s) or other Wallet(s).'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Transfer funds')).toBeInTheDocument();
        expect(screen.getByText('Deposit funds')).toBeInTheDocument();
    });

    test('should navigate to transfer page on click of "Transfer funds" button', () => {
        const pushMock = jest.fn();
        mockUseHistory.mockReturnValue({ push: pushMock });

        render(<TransactionsNoDataState />);

        fireEvent.click(screen.getByText('Transfer funds'));

        expect(pushMock).toHaveBeenCalledWith('/wallets/cashier/transfer');
    });

    test('should navigate to deposit page on click of "Deposit funds" button', () => {
        const pushMock = jest.fn();
        mockUseHistory.mockReturnValue({ push: pushMock });

        render(<TransactionsNoDataState />);

        fireEvent.click(screen.getByText('Deposit funds'));

        expect(pushMock).toHaveBeenCalledWith('/wallets/cashier/deposit');
    });
});
