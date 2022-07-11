import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import VerificationEmail from '../verification-email';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<VerificationEmail />', () => {
    const mockProps = () => ({
        is_resend_clicked: false,
        is_withdrawal: false,
        resendVerificationEmail: jest.fn(),
        setIsResendClicked: jest.fn(),
    });

    it('component should be rendered', () => {
        const props = mockProps();
        render(<VerificationEmail {...props} />);

        expect(screen.getByText("We've sent you an email.")).toBeInTheDocument();
        expect(
            screen.getByText('Please check your email for the verification link to complete the process.')
        ).toBeInTheDocument();
    });

    it("React.Fragment should be rendered if 'is_resend_clicked' prop is true", () => {
        const props = mockProps();
        props.is_resend_clicked = true;

        render(<VerificationEmail {...props} />);
        const btn = screen.getByRole('button');

        expect(screen.getByText("Didn't receive the email?")).toBeInTheDocument();
        expect(
            screen.getByText("Check your spam or junk folder. If it's not there, try resending the email.")
        ).toBeInTheDocument();
        expect(btn).toHaveClass('verification-email__resend-button');
    });

    it('resendVerificationEmail func should be triggered when resend button in clicked', () => {
        const props = mockProps();
        props.is_resend_clicked = true;

        render(<VerificationEmail {...props} />);

        const btn = screen.getByRole('button', { name: 'Resend email' });
        fireEvent.click(btn);

        expect(props.resendVerificationEmail).toHaveBeenCalledTimes(1);
    });

    it("button with 'Didn't receive the email?' text should be rendered when 'is_resend_clicked' prop is false", () => {
        const props = mockProps();

        render(<VerificationEmail {...props} />);

        expect(screen.getByRole('button', { name: "Didn't receive the email?" })).toBeInTheDocument();
    });

    it('setIsResendClicked func should be triggered', () => {
        const props = mockProps();

        render(<VerificationEmail {...props} />);

        const btn = screen.getByRole('button', { name: "Didn't receive the email?" });
        fireEvent.click(btn);

        expect(props.setIsResendClicked).toHaveBeenCalledTimes(1);
    });
});
