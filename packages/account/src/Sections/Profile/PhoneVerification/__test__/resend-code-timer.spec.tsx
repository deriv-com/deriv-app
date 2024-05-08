import { render, screen, waitFor } from '@testing-library/react';
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

    it('should check if title changes when timer expires and value of resend_code_text is Didn’t get the code?', async () => {
        // Need to increase the default timeout for testcase in order to wait for asserting change in the text
        render(<ResendCodeTimer resend_code_text='Didn’t get the code?' count_from={6} />);
        const resend_button = screen.getByRole('button', { name: 'Didn’t get the code?(6s)' });
        userEvent.click(resend_button);

        await waitFor(
            () => {
                const resend_button = screen.getByRole('button', { name: 'Didn’t get the code?' });
                expect(resend_button).toBeInTheDocument();
            },
            { timeout: 7000 }
        );
    }, 10000);

    it('should check if title displays countdown time when timer starts and value of resend_code_text is Didn’t get the code?', async () => {
        render(<ResendCodeTimer resend_code_text='Didn’t get the code?' count_from={6} />);
        const resend_button = screen.getByRole('button', { name: 'Didn’t get the code?(6s)' });
        userEvent.click(resend_button);

        await waitFor(
            () => {
                const resend_button = screen.getByRole('button', { name: 'Didn’t get the code?(4s)' });
                expect(resend_button).toBeInTheDocument();
            },
            { timeout: 4000 }
        );
    }, 10000);

    it('should check if title changes when timer expires and value of resend_code_text is Resend code', async () => {
        render(<ResendCodeTimer resend_code_text='Resend code' count_from={6} />);
        const resend_button = screen.getByRole('button', { name: 'Resend code in 6s' });
        userEvent.click(resend_button);

        await waitFor(
            () => {
                const resend_button = screen.getByRole('button', { name: 'Resend code' });
                expect(resend_button).toBeInTheDocument();
            },
            { timeout: 7000 }
        );
    }, 10000);

    it('should check if title displays countdown time when timer starts and value of resend_code_text is Resend code', async () => {
        render(<ResendCodeTimer resend_code_text='Resend code' count_from={6} />);
        const resend_button = screen.getByRole('button', { name: 'Resend code in 6s' });
        userEvent.click(resend_button);

        await waitFor(
            () => {
                const resend_button = screen.getByRole('button', { name: 'Resend code in 4s' });
                expect(resend_button).toBeInTheDocument();
            },
            { timeout: 4000 }
        );
    }, 10000);
});
