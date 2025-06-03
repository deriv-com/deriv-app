import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import WithdrawalVerificationRequest from '../WithdrawalVerificationRequest';

describe('WithdrawalVerificationRequest', () => {
    test('should render component correctly', () => {
        render(<WithdrawalVerificationRequest sendEmail={jest.fn()} />);

        expect(
            screen.getByText("To continue withdrawal, verify it's you. We will send a verification link to your email.")
        ).toBeInTheDocument();

        const sendEmailButton = screen.getByRole('button', { name: 'Send link' });
        expect(sendEmailButton).toBeInTheDocument();

        const emailVerificationIcon = screen.getByTestId('dt_withdrawal_verification_request_icon');
        expect(emailVerificationIcon).toBeInTheDocument();
    });

    test('should call sendEmail function on button click', () => {
        const sendEmailMock = jest.fn();
        render(<WithdrawalVerificationRequest sendEmail={sendEmailMock} />);

        fireEvent.click(screen.getByRole('button', { name: 'Send link' }));

        expect(sendEmailMock).toHaveBeenCalledTimes(1);
    });
});
