import { render, screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import ResendCodeTimer from '../resend-code-timer';

describe('ConfirmPhoneNumber', () => {
    it('should disable button after its clicked', () => {
        render(<ResendCodeTimer resend_code_text='Resend code' count_from={60} />);
        const resend_button = screen.getByRole('button', { name: 'Resend code in 60s' });

        userEvent.click(resend_button);

        expect(resend_button).toBeDisabled();
    });

    it('should display correct title if value of resend_code_text is Resend code', () => {
        render(<ResendCodeTimer resend_code_text='Resend code' count_from={60} />);
        const resend_button = screen.getByRole('button', { name: 'Resend code in 60s' });
        expect(resend_button).toBeInTheDocument();
    });

    it('should display correct title if value of resend_code_text is Didn’t get the code?', () => {
        render(<ResendCodeTimer resend_code_text='Didn’t get the code?' count_from={60} />);
        const resend_button = screen.getByRole('button', { name: 'Didn’t get the code?(60s)' });
        expect(resend_button).toBeInTheDocument();
    });
});
