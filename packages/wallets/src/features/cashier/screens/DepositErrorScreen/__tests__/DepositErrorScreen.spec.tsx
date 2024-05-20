import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import DepositErrorScreen from '../DepositErrorScreen';

describe('DepositErrorScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should show default deposit error details', () => {
        const error = {
            code: 'MyError',
            message: 'Error message',
        };

        render(<DepositErrorScreen error={error} />);

        expect(screen.getByText('Oops, something went wrong!')).toBeInTheDocument();
        expect(screen.getByText('Error message')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    });

    it('should show correct deposit error screen for crypto suspended currency error', () => {
        const error = {
            code: 'CryptoSuspendedCurrency',
            message: 'Crypto Suspended Currency',
        };

        render(<DepositErrorScreen currency='BTC' error={error} />);

        expect(screen.getByText('BTC Wallet deposits are temporarily unavailable')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Due to system maintenance, deposits with your BTC Wallet are unavailable at the moment. Please try again later.'
            )
        ).toBeInTheDocument();
        expect(screen.queryByText('Try again')).not.toBeInTheDocument();
    });

    it('should show correct deposit error screen for crypto suspended deposit error', () => {
        const error = {
            code: 'CryptoDisabledCurrencyDeposit',
            message: 'Crypto Disabled Currency Deposit',
        };

        render(<DepositErrorScreen currency='BTC' error={error} />);

        expect(screen.getByText('BTC Wallet deposits are temporarily unavailable')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Due to system maintenance, deposits with your BTC Wallet are unavailable at the moment. Please try again later.'
            )
        ).toBeInTheDocument();
        expect(screen.queryByText('Try again')).not.toBeInTheDocument();
    });

    it('should show correct deposit error screen for crypto connection error', () => {
        const error = {
            code: 'CryptoConnectionError',
            message: 'Crypto Connection Error',
        };

        render(<DepositErrorScreen error={error} />);

        expect(screen.getByText('Maintenance in progess')).toBeInTheDocument();
        expect(screen.getByText('Crypto Connection Error')).toBeInTheDocument();
        expect(screen.queryByText('Try again')).not.toBeInTheDocument();
    });

    it('should reload page when user clicks on button', () => {
        const reloadMock = jest.fn();
        Object.defineProperty(window, 'location', {
            value: { reload: reloadMock },
            writable: true,
        });

        const error = {
            code: 'CashierForwardError',
            message: 'Error message',
        };

        render(<DepositErrorScreen error={error} />);

        expect(screen.getByText('Oops, something went wrong!')).toBeInTheDocument();
        expect(screen.getByText('Error message')).toBeInTheDocument();
        const ReloadButton = screen.getByRole('button', { name: 'Try again' });

        fireEvent.click(ReloadButton);
        expect(reloadMock).toHaveBeenCalled();
    });
});
