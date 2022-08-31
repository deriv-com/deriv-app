import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import WithdrawalVerificationEmail from '../withdrawal-verification-email';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('Components/verification-email', () => jest.fn(() => 'VerificationEmail'));

describe('<WithdrawalVerificationEmail />', () => {
    const props = {
        is_email_sent: true,
        recentTransactionOnMount: jest.fn(),
        sendVerificationEmail: jest.fn(),
    };

    it('component should be rendered', () => {
        render(<WithdrawalVerificationEmail {...props} />);

        expect(screen.getByTestId('dt_cashier_wrapper')).toBeInTheDocument();
    });

    it("<VerificationEmail /> component should be rendered when 'is_email_sent' prop is true", () => {
        render(<WithdrawalVerificationEmail {...props} />);

        expect(screen.getByText('VerificationEmail')).toBeInTheDocument();
    });

    it("React.Fragment should be rendered when 'is_email_sent' prop is false", () => {
        render(<WithdrawalVerificationEmail {...props} is_email_sent={false} />);

        expect(screen.getByText('Please help us verify your withdrawal request.')).toBeInTheDocument();
        expect(
            screen.getByText(
                "Hit the button below and we'll send you an email with a link. Click that link to verify your withdrawal request."
            )
        ).toBeInTheDocument();
        expect(screen.getByText('This is to protect your account from unauthorised withdrawals.')).toBeInTheDocument();
    });

    it("'Send email' button should be rendered when 'is_email_sent' prop is false", () => {
        render(<WithdrawalVerificationEmail {...props} is_email_sent={false} />);

        expect(screen.getByRole('button', { name: 'Send email' })).toBeInTheDocument();
    });

    it("sendVerificationEmail func should be triggered when click on 'Send email' button", () => {
        render(<WithdrawalVerificationEmail {...props} is_email_sent={false} />);

        const btn = screen.getByRole('button', { name: 'Send email' });
        fireEvent.click(btn);

        expect(props.sendVerificationEmail).toHaveBeenCalled();
    });
});
