import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ResendEmailButtonWrapper from '../resend-email-button-wrapper';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<ResendEmailButtonWrapper/>', () => {
    const resendVerificationEmail = jest.fn();

    it('component should be rendered', () => {
        render(<ResendEmailButtonWrapper resend_timeout={10} resendVerificationEmail={resendVerificationEmail} />);

        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('Resend button should be disabled when resend_timeout is less then 60', () => {
        render(<ResendEmailButtonWrapper resend_timeout={10} resendVerificationEmail={resendVerificationEmail} />);

        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('Resend button should not be disabled when resend_timeout is greater then 60', () => {
        render(<ResendEmailButtonWrapper resend_timeout={70} resendVerificationEmail={resendVerificationEmail} />);

        expect(screen.getByRole('button')).toBeEnabled();
    });

    it('resendVerificationEmail function to be called when resend button is called', () => {
        render(<ResendEmailButtonWrapper resend_timeout={70} resendVerificationEmail={resendVerificationEmail} />);

        const btn = screen.getByRole('button');
        fireEvent.click(btn);

        expect(resendVerificationEmail).toHaveBeenCalled();
    });
});
