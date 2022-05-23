import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import EmailSent from '../email-sent';

describe('<EmailSent />', () => {
    const resendVerificationEmail = jest.fn();
    const setIsResendClicked = jest.fn();

    it('component should be rendered', () => {
        const { container } = render(<EmailSent />);

        expect(container.querySelector('.email-sent')).toBeInTheDocument();
        expect(screen.getByText("We've sent you an email.")).toBeInTheDocument();
        expect(
            screen.getByText('Please check your email for the verification link to complete the process.')
        ).toBeInTheDocument();
    });

    it("React.Fragment should be rendered if 'is_resend_clicked' prop is true", () => {
        const { container } = render(<EmailSent is_resend_clicked />);

        expect(screen.getByText("Didn't receive the email?")).toBeInTheDocument();
        expect(
            screen.getByText("Check your spam or junk folder. If it's not there, try resending the email.")
        ).toBeInTheDocument();
        expect(container.querySelector('.email-sent__resend-button')).toBeInTheDocument();
    });

    it("resendVerificationEmail func should not be triggered when 'resend_timeout' prop is less than 60", () => {
        const resend_timeout = 59;
        const { container } = render(
            <EmailSent
                is_resend_clicked
                resend_timeout={resend_timeout}
                resendVerificationEmail={resendVerificationEmail}
            />
        );

        const btn = container.querySelector('.email-sent__resend-button');
        fireEvent.click(btn);

        expect(resendVerificationEmail).toHaveBeenCalledTimes(0);
    });

    it("resendVerificationEmail func should be triggered when 'resend_timeout' prop is more or equal 60", () => {
        const resend_timeout = 60;
        const { container } = render(
            <EmailSent
                is_resend_clicked
                resend_timeout={resend_timeout}
                resendVerificationEmail={resendVerificationEmail}
            />
        );

        const btn = container.querySelector('.email-sent__resend-button');
        fireEvent.click(btn);

        expect(resendVerificationEmail).toHaveBeenCalledTimes(1);
    });

    it("button with 'Didn't receive the email?' text should be rendered when 'is_resend_clicked' prop is false", () => {
        render(<EmailSent is_resend_clicked={false} />);

        expect(screen.getByRole('button', { name: "Didn't receive the email?" })).toBeInTheDocument();
    });

    it('setIsResendClicked func should be triggered', () => {
        render(<EmailSent is_resend_clicked={false} setIsResendClicked={setIsResendClicked} />);

        const btn = screen.getByRole('button', { name: "Didn't receive the email?" });
        fireEvent.click(btn);

        expect(setIsResendClicked).toHaveBeenCalledTimes(1);
    });
});
