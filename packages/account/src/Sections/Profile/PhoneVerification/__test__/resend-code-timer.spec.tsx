import { render, screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import ResendCodeTimer from '../resend-code-timer';

describe('ConfirmPhoneNumber', () => {
    it('should disable button after its clicked', () => {
        render(<ResendCodeTimer resend_code_text={'Resend code'} />);
        const resend_button = screen.getByRole('button', { name: 'Resend code' });

        userEvent.click(resend_button);

        expect(resend_button).toBeDisabled();
    });

    it('should display Resend code if user requests for new code inside email verification section', () => {
        render(<ResendCodeTimer resend_code_text={'Resend code'} />);
        const resend_button = screen.getByRole('button', { name: 'Resend code' });
        expect(resend_button).toBeInTheDocument();
    });

    it('should display Didn’t get the code? if user requests for new code inside phone number verification section', () => {
        render(<ResendCodeTimer resend_code_text={'Didn’t get the code?'} />);
        const resend_button = screen.getByRole('button', { name: 'Didn’t get the code?' });
        expect(resend_button).toBeInTheDocument();
    });
});
