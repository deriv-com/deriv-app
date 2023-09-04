import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DigitForm, { TDigitForm } from '../digit-form';
import userEvent from '@testing-library/user-event';
import { WS } from '@deriv/shared';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        authorized: {
            accountSecurity: jest.fn().mockResolvedValue({
                error: { message: "That's not the right code. Please try again.", code: 'InvalidOTP' },
            }),
        },
    },
}));

describe('<DigitForm />', () => {
    const mock_props: TDigitForm = {
        is_enabled: false,
        setTwoFAStatus: jest.fn(),
        setTwoFAChangedStatus: jest.fn(),
        is_language_changing: true,
    };

    it('should render the DigitForm component', () => {
        render(<DigitForm {...mock_props} />);
        const digit_form_label = screen.getByText('Authentication code');
        expect(digit_form_label).toBeInTheDocument();
    });

    it('should change button text when user enables or disables 2FA', () => {
        const enabled_props = {
            ...mock_props,
            is_enabled: true,
        };
        render(<DigitForm {...mock_props} />);
        const enableButton = screen.getByRole('button', { name: /Enable/i });
        expect(enableButton).toBeInTheDocument();

        render(<DigitForm {...enabled_props} />);
        const disableButton = screen.getByRole('button', { name: /Disable/i });
        expect(disableButton).toBeInTheDocument();
    });

    it('should display error if submits empty form', async () => {
        render(<DigitForm {...mock_props} />);

        const nameInput = screen.getByRole('textbox');
        await userEvent.click(nameInput);

        await waitFor(() => {
            const error = screen.getByText(/Digit code is required./i);
            expect(error).toBeInTheDocument();
        });
    });

    it('should display error if user types alphanumeric characters', async () => {
        render(<DigitForm {...mock_props} />);
        const digitInput = screen.getByRole('textbox');

        userEvent.type(digitInput, '669yi9');

        await waitFor(() => {
            const error = screen.getByText(/Digit code must only contain numbers./i);
            expect(error).toBeInTheDocument();
        });
    });

    it('should display error if user types less than 6 digits', async () => {
        render(<DigitForm {...mock_props} />);
        const digitInput = screen.getByRole('textbox');

        userEvent.type(digitInput, '6699');

        await waitFor(() => {
            const error = screen.getByText(/Length of digit code must be 6 characters./i);
            expect(error).toBeInTheDocument();
        });
    });

    it('should display error if user types invalid OTP', async () => {
        render(<DigitForm {...mock_props} />);
        const digitInput = screen.getByRole('textbox');
        const invalidOTP = '786789';
        userEvent.type(digitInput, invalidOTP);

        const submitButton = screen.getByRole('button', { name: /Enable/i });
        userEvent.click(submitButton);

        await waitFor(() => {
            const error = screen.getByText(/That's not the right code. Please try again./i);
            expect(error).toBeInTheDocument();
        });
    });

    it('should disable button when form is empty or validation fails', async () => {
        render(<DigitForm {...mock_props} />);
        const submitButton = screen.getByRole('button', { name: /Enable/i });
        expect(submitButton).toBeDisabled();

        const digitInput = screen.getByRole('textbox');
        userEvent.type(digitInput, '669yi9');
        await waitFor(() => {
            expect(submitButton).toBeDisabled();
        });
    });

    it('should display error if response error object does not contain error code', async () => {
        WS.authorized.accountSecurity.mockResolvedValue({
            error: { message: '', code: '' },
        });

        render(<DigitForm {...mock_props} />);

        const digitInput = screen.getByRole('textbox');
        const invalidOTP = '786789';

        userEvent.type(digitInput, invalidOTP);

        const submitButton = screen.getByRole('button', { name: /Enable/i });
        userEvent.click(submitButton);

        await waitFor(async () => {
            const error = screen.queryByText(/That's not the right code. Please try again./i);
            expect(error).not.toBeInTheDocument();
        });
    });

    it('should display error if response error object does not contain error code', async () => {
        WS.authorized.accountSecurity.mockResolvedValue({
            success: { message: '', code: '' },
        });

        render(<DigitForm {...mock_props} />);

        const digitInput = screen.getByRole('textbox');
        const invalidOTP = '786789';

        userEvent.type(digitInput, invalidOTP);

        const submitButton = screen.getByRole('button', { name: /Enable/i });
        userEvent.click(submitButton);

        await waitFor(async () => {
            const error = screen.queryByText(/That's not the right code. Please try again./i);
            expect(error).not.toBeInTheDocument();
        });
    });
});
