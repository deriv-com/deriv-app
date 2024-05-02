import { render, screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import ResendCodeTimer from '../resend-code-timer';

describe('ConfirmPhoneNumber', () => {
    it('should disable button when Resend code is clicked', () => {
        render(<ResendCodeTimer />);
        const resend_button = screen.getByRole('button', { name: 'Resend code' });

        userEvent.click(resend_button);

        expect(resend_button).toBeDisabled();
    });
});
