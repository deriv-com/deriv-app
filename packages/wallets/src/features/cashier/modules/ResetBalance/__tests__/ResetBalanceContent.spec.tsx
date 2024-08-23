import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getResetBalanceContent } from '../ResetBalanceContent';

describe('getResetBalanceContent', () => {
    const mockLocalize = jest.fn(key => key);
    const mockResetBalance = jest.fn();
    const mockNavigateToTransfer = jest.fn();

    const content = getResetBalanceContent(mockLocalize, mockResetBalance, mockNavigateToTransfer);

    it('returns the correct content for resetAvailable', () => {
        const ResetAvailableComponent = content.resetAvailable;
        render(<ResetAvailableComponent />);

        expect(screen.getAllByText('Reset balance')[0]).toBeInTheDocument();
        expect(screen.getByText('Reset your virtual balance to 10,000.00 USD.')).toBeInTheDocument();

        const button = screen.getByRole('button', { name: 'Reset balance' });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        expect(mockResetBalance).toHaveBeenCalledTimes(1);
    });

    it('returns the correct content for resetUnavailable', () => {
        const ResetUnavailableComponent = content.resetUnavailable;
        render(<ResetUnavailableComponent />);

        expect(screen.getByText('Reset balance unavailable')).toBeInTheDocument();
        expect(screen.getByText('You can reset your balance when it is below USD 10,000.00')).toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('returns the correct content for success', () => {
        const SuccessComponent = content.success;
        render(<SuccessComponent />);

        expect(screen.getByText('Success')).toBeInTheDocument();
        expect(screen.getByText('Your balance has been reset to 10,000.00 USD.')).toBeInTheDocument();

        const button = screen.getByRole('button', { name: 'Transfer funds' });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        expect(mockNavigateToTransfer).toHaveBeenCalledTimes(1);
    });
});
