import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import WithdrawalVerificationSent from '../WithdrawalVerificationSent';

describe('WithdrawalVerificationSent', () => {
    test('should render component correctly', () => {
        render(<WithdrawalVerificationSent counter={0} sendEmail={jest.fn()} />);

        expect(screen.getByText("We've sent you an email.")).toBeInTheDocument();

        expect(
            screen.getByText('Please check your email for the verification link to complete the process.')
        ).toBeInTheDocument();

        const emailSentIcon = screen.getByTestId('dt_withdrawal_verification_sent_icon');
        expect(emailSentIcon).toBeInTheDocument();

        expect(screen.getByRole('button', { name: "Didn't receive the email?" })).toBeInTheDocument();
    });

    test('should call sendEmail prop and show resend email button', async () => {
        const sendEmailMock = jest.fn();
        render(<WithdrawalVerificationSent counter={10} sendEmail={sendEmailMock} />);

        fireEvent.click(screen.getByRole('button', { name: "Didn't receive the email?" }));

        expect(sendEmailMock).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(
                screen.getByText("Check your spam or junk folder. If it's not there, try resending the email.")
            ).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Resend email/ })).toBeInTheDocument();
        });
    });

    test('should call sendEmail function again on Resend button click after counter ends', async () => {
        const sendEmailMock = jest.fn();
        render(<WithdrawalVerificationSent counter={10} sendEmail={sendEmailMock} />);

        fireEvent.click(screen.getByRole('button', { name: "Didn't receive the email?" }));

        expect(sendEmailMock).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Resend email/ })).toBeInTheDocument();
            fireEvent.click(screen.getByRole('button', { name: /Resend email/ }));
            expect(sendEmailMock).toHaveBeenCalledTimes(1);
        });
    });
});
