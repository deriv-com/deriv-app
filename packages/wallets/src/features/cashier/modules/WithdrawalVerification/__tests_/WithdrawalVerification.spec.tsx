import React from 'react';
import { useCountdown } from 'usehooks-ts';
import { useSettings, useVerifyEmail } from '@deriv/api';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import WithdrawalVerification from '../WithdrawalVerification';
import '@testing-library/jest-dom';

jest.mock('../WithdrawalVerificationRequest', () => ({
    ...jest.requireActual('../WithdrawalVerificationRequest'),
}));

jest.mock('../WithdrawalVerificationSent', () => ({
    ...jest.requireActual('../WithdrawalVerificationSent'),
}));

jest.mock('usehooks-ts', () => ({
    useCountdown: jest.fn(() => [0, { resetCountdown: jest.fn(), startCountdown: jest.fn() }]),
}));

jest.mock('@deriv/api', () => ({
    useSettings: jest.fn(() => ({ data: { email: null } })),
    useVerifyEmail: jest.fn(() => ({ mutate: jest.fn() })),
}));

describe('WithdrawalVerification', () => {
    it('should render WithdrawalVerificationRequest initially', () => {
        render(<WithdrawalVerification />);
        expect(screen.getByText('Please help us verify your withdrawal request.')).toBeInTheDocument();
    });

    it('should send withdrawal verification email and render WithdrawalVerificationSent after clicking send email', async () => {
        (useSettings as jest.Mock).mockImplementation(() => ({ data: { email: 'test@example.com' } }));
        const mockMutate = jest.fn();
        (useVerifyEmail as jest.Mock).mockImplementation(() => ({
            mutate: mockMutate,
        }));
        const mockResetCountdown = jest.fn();
        const mockStartCountdown = jest.fn();
        (useCountdown as jest.Mock).mockImplementation(() => [
            60,
            { resetCountdown: mockResetCountdown, startCountdown: mockStartCountdown },
        ]);

        render(<WithdrawalVerification />);

        fireEvent.click(screen.getByRole('button', { name: 'Send email' }));

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalled();
            expect(mockResetCountdown).toHaveBeenCalled();
            expect(mockStartCountdown).toHaveBeenCalled();
            expect(
                screen.getByText('Please check your email for the verification link to complete the process.')
            ).toBeInTheDocument();
        });
    });

    it('should not send withdrawal verification email if email is not fetched from useSettings properly', async () => {
        (useSettings as jest.Mock).mockImplementation(() => ({ data: { email: null } }));
        const mockMutate = jest.fn();
        (useVerifyEmail as jest.Mock).mockImplementation(() => ({
            mutate: mockMutate,
        }));
        const mockResetCountdown = jest.fn();
        const mockStartCountdown = jest.fn();
        (useCountdown as jest.Mock).mockImplementation(() => [
            60,
            { resetCountdown: mockResetCountdown, startCountdown: mockStartCountdown },
        ]);

        render(<WithdrawalVerification />);

        fireEvent.click(screen.getByRole('button', { name: 'Send email' }));

        await waitFor(() => {
            expect(mockMutate).not.toHaveBeenCalled();
            expect(mockResetCountdown).not.toHaveBeenCalled();
            expect(mockStartCountdown).not.toHaveBeenCalled();
            expect(
                screen.queryByText('Please check your email for the verification link to complete the process.')
            ).not.toBeInTheDocument();
        });
    });
});
