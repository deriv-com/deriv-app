import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WithdrawalErrorScreen from '../WithdrawalErrorScreen';

describe('WithdrawalErrorScreen', () => {
    let resetError: jest.Mock, setResendEmail: jest.Mock;

    beforeEach(() => {
        resetError = jest.fn();
        setResendEmail = jest.fn();
    });

    describe('InvalidToken', () => {
        const error = {
            code: 'InvalidToken',
            message: 'Error message',
        };

        it('should show proper error for `InvalidToken` error code', () => {
            render(<WithdrawalErrorScreen error={error} resetError={resetError} setResendEmail={setResendEmail} />);

            expect(screen.getByText('Email verification failed')).toBeInTheDocument();
            expect(
                screen.getByText('The verification link you used is invalid or expired. Please request for a new one.')
            ).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Resend email' })).toBeInTheDocument();
        });

        it('should trigger proper callbacks when the user is clicking on `Resend email` button', () => {
            render(<WithdrawalErrorScreen error={error} resetError={resetError} setResendEmail={setResendEmail} />);

            const resendEmailBtn = screen.getByRole('button', { name: 'Resend email' });

            userEvent.click(resendEmailBtn);

            expect(resetError).toHaveBeenCalledTimes(1);
            expect(setResendEmail).toHaveBeenCalledTimes(1);
            expect(setResendEmail).toHaveBeenCalledWith(true);
        });
    });

    it('should show default error', () => {
        const error = {
            code: 'MyError',
            message: 'Error message',
        };

        render(<WithdrawalErrorScreen error={error} resetError={resetError} setResendEmail={setResendEmail} />);

        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText('Error message')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    });

    it('should trigger `resetError` callback whe the user is clicking on `OK` button', () => {
        const error = {
            code: 'MyError',
            message: 'Error message',
        };

        render(<WithdrawalErrorScreen error={error} resetError={resetError} setResendEmail={setResendEmail} />);

        const OKBtn = screen.getByRole('button', { name: 'OK' });

        userEvent.click(OKBtn);

        expect(resetError).toHaveBeenCalledTimes(1);
    });
});
