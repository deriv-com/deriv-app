import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useMutation } from '@deriv/api-v2';
import { act, fireEvent, render, screen } from '@testing-library/react';
import useAllBalanceSubscription from '../../../../../hooks/useAllBalanceSubscription';
import ResetBalance from '../ResetBalance';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(),
    useMutation: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    Loader: jest.fn(() => <div>Loading...</div>),
}));

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
}));

jest.mock('../../../../../hooks/useAllBalanceSubscription', () => jest.fn());

describe('ResetBalance', () => {
    const mockHistory = { push: jest.fn() };
    const mockMutate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useHistory as jest.Mock).mockReturnValue(mockHistory);
        (useMutation as jest.Mock).mockReturnValue({
            isLoading: false,
            isSuccess: false,
            mutate: mockMutate,
        });
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { loginid: 'VRTC1234' },
        });
    });

    it('renders with initial state when balance is below 10,000', () => {
        (useAllBalanceSubscription as jest.Mock).mockReturnValue({
            data: { VRTC1234: { balance: 5000 } },
            isLoading: false,
        });
        (useMutation as jest.Mock).mockReturnValue({
            isLoading: true,
            isSuccess: false,
            mutate: mockMutate,
        });

        render(<ResetBalance />);

        expect(screen.getByRole('button', { name: 'Reset balance' })).toBeInTheDocument();
        expect(screen.getByText('Reset your virtual balance to 10,000.00 USD.')).toBeInTheDocument();
    });

    it('renders unavailable state when balance is 10,000 or above', () => {
        (useAllBalanceSubscription as jest.Mock).mockReturnValue({
            data: { VRTC1234: { balance: 10000 } },
            isLoading: false,
        });

        render(<ResetBalance />);

        expect(screen.queryByRole('button', { name: 'Reset balance' })).not.toBeInTheDocument();
        expect(screen.getByText('Reset balance unavailable')).toBeInTheDocument();
        expect(screen.getByText('You can reset your balance when it is below USD 10,000.00')).toBeInTheDocument();
    });

    it('renders success state', () => {
        (useAllBalanceSubscription as jest.Mock).mockReturnValue({
            data: { VRTC1234: { balance: 5000 } },
            isLoading: false,
        });
        (useMutation as jest.Mock).mockReturnValue({
            isLoading: false,
            isSuccess: true,
            mutate: mockMutate,
        });

        render(<ResetBalance />);

        expect(screen.getByText('Success')).toBeInTheDocument();
        expect(screen.getByText('Your balance has been reset to 10,000.00 USD.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Transfer funds' })).toBeInTheDocument();
    });

    it('shows the loader if balance data is loading', () => {
        (useAllBalanceSubscription as jest.Mock).mockReturnValue({
            data: { VRTC1234: { balance: 10000 } },
            isLoading: true,
        });
        render(<ResetBalance />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('triggers resetBalance function on button click', async () => {
        (useAllBalanceSubscription as jest.Mock).mockReturnValue({
            data: { VRTC1234: { balance: 5000 } },
            isLoading: false,
        });

        render(<ResetBalance />);

        const resetBalanceButton = screen.getByRole('button', { name: 'Reset balance' });
        fireEvent.click(resetBalanceButton);

        await act(async () => {
            expect(mockMutate).toHaveBeenCalled();
        });
    });

    it('redirects to transfer page on button click when reset is successful', async () => {
        (useAllBalanceSubscription as jest.Mock).mockReturnValue({
            data: { VRTC1234: { balance: 5000 } },
            isLoading: false,
        });
        (useMutation as jest.Mock).mockReturnValue({
            isSuccess: true,
            mutate: mockMutate,
        });

        render(<ResetBalance />);

        const transferFundsButton = screen.getByRole('button', { name: 'Transfer funds' });
        fireEvent.click(transferFundsButton);

        expect(mockHistory.push).toHaveBeenCalledWith('/wallet/account-transfer');
    });

    it('handles case when balanceData is undefined', () => {
        (useAllBalanceSubscription as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: false,
        });

        render(<ResetBalance />);

        expect(screen.queryByRole('button', { name: 'Reset balance' })).not.toBeInTheDocument();
        expect(screen.getByText('Reset balance unavailable')).toBeInTheDocument();
    });

    it('handles case when activeWallet is undefined', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: false,
        });
        (useAllBalanceSubscription as jest.Mock).mockReturnValue({
            data: { VRTC1234: { balance: 5000 } },
        });

        render(<ResetBalance />);

        expect(screen.queryByRole('button', { name: 'Reset balance' })).not.toBeInTheDocument();
        expect(screen.getByText('Reset balance unavailable')).toBeInTheDocument();
    });
});
