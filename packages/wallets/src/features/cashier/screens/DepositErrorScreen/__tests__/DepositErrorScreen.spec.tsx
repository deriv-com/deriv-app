import React from 'react';
import { useHistory } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import DepositErrorScreen from '../DepositErrorScreen';

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
}));
const mockUseHistory = useHistory as jest.Mock;

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
        expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    });

    it('should redirect to wallets when user clicks on OK button', () => {
        const pushMock = jest.fn();
        mockUseHistory.mockReturnValue({ push: pushMock });

        const error = {
            code: 'MyError',
            message: 'Error message',
        };

        render(<DepositErrorScreen error={error} />);

        const OkButton = screen.getByRole('button', { name: 'OK' });

        fireEvent.click(OkButton);
        expect(pushMock).toHaveBeenCalledWith('/wallets');
    });

    it('should reload page when user clicks on OK button for `CashierForwardError` error code', () => {
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
        const OkButton = screen.getByRole('button', { name: 'OK' });

        fireEvent.click(OkButton);
        expect(reloadMock).toHaveBeenCalled();
    });
});
