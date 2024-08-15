import React from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@deriv/api-v2';
import { act, fireEvent, render, screen } from '@testing-library/react';
import ResetBalance from '../ResetBalance';

jest.mock('@deriv/api-v2', () => ({
    useMutation: jest.fn(() => ({
        isSuccess: false,
        mutate: jest.fn(),
    })),
}));

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(() => ({
        push: jest.fn(),
    })),
}));

describe('ResetBalance', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render with initial state', () => {
        render(<ResetBalance />);

        expect(screen.getByRole('button', { name: 'Reset balance' })).toBeInTheDocument();
        expect(screen.getByText('Reset your virtual balance to 10,000.00 USD.')).toBeInTheDocument();
    });

    it('should render success state', () => {
        (useMutation as jest.Mock).mockReturnValueOnce({
            isSuccess: true,
            mutate: jest.fn(),
        });

        render(<ResetBalance />);

        expect(screen.getByText('Success')).toBeInTheDocument();
        expect(screen.getByText('Your balance has been reset to 10,000.00 USD.')).toBeInTheDocument();
    });

    it('should trigger resetBalance function on button click', async () => {
        const { mutate } = useMutation('topup_virtual');
        (useMutation as jest.Mock).mockReturnValueOnce({
            isSuccess: false,
            mutate,
        });

        const { push } = useHistory();
        (useHistory as jest.Mock).mockReturnValueOnce({
            push,
        });

        render(<ResetBalance />);

        const resetBalanceButton = screen.getByRole('button', { name: 'Reset balance' });
        fireEvent.click(resetBalanceButton);

        await act(async () => {
            expect(mutate).toHaveBeenCalled();
        });
    });

    it('should redirect to transfer page on button click when reset is successful', async () => {
        (useMutation as jest.Mock).mockReturnValueOnce({
            isSuccess: true,
            mutate: jest.fn(),
        });

        const { push } = useHistory();
        (useHistory as jest.Mock).mockReturnValueOnce({
            push,
        });

        render(<ResetBalance />);

        const transferFundsButton = screen.getByRole('button', { name: 'Transfer funds' });
        fireEvent.click(transferFundsButton);

        expect(push).toHaveBeenCalledWith('/wallet/account-transfer');
    });
});
