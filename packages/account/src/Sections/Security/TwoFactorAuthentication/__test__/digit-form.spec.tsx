import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WS } from '@deriv/shared';
import { StoreProvider, mockStore } from '@deriv/stores';
import DigitForm from '../digit-form';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        authorized: {
            accountSecurity: jest.fn(),
        },
    },
}));

describe('<DigitForm />', () => {
    const store = mockStore({});

    const renderComponent = ({ store_config = store }) => {
        render(
            <StoreProvider store={store_config}>
                <DigitForm />
            </StoreProvider>
        );
    };

    it('should render the DigitForm component', () => {
        renderComponent({ store_config: store });

        const digit_form_label = screen.getByText(/Authentication code/i);
        expect(digit_form_label).toBeInTheDocument();
    });

    it('should disable button when form is empty or validation fails', async () => {
        renderComponent({ store_config: store });
        const submitButton = screen.getByRole('button', { name: /Enable/i });
        expect(submitButton).toBeDisabled();

        const digitInput = screen.getByRole('textbox');
        userEvent.type(digitInput, '669yi9');
        await waitFor(() => {
            expect(submitButton).toBeDisabled();
        });
    });

    it('should change button text when user enables or disables 2FA', () => {
        const new_store_config = mockStore({
            client: {
                has_enabled_two_fa: true,
            },
        });

        renderComponent({ store_config: store });
        const enableButton = screen.getByRole('button', { name: /Enable/i });
        expect(enableButton).toBeInTheDocument();

        renderComponent({ store_config: new_store_config });
        const disableButton = screen.getByRole('button', { name: /Disable/i });
        expect(disableButton).toBeInTheDocument();
    });

    it('should display error if submits empty form', async () => {
        renderComponent({ store_config: store });

        const nameInput = screen.getByRole('textbox');
        await userEvent.click(nameInput);

        userEvent.tab();

        await waitFor(() => {
            const error = screen.getByText(/Digit code is required./i);
            expect(error).toBeInTheDocument();
        });
    });

    it('should display error if user types alphanumeric characters', async () => {
        renderComponent({ store_config: store });
        const digitInput = screen.getByRole('textbox');

        userEvent.type(digitInput, '669yi9');
        userEvent.tab();

        await waitFor(() => {
            const error = screen.getByText(/Digit code must only contain numbers./i);
            expect(error).toBeInTheDocument();
        });
    });

    it('should display error if user types less than 6 digits', async () => {
        renderComponent({ store_config: store });
        const digitInput = screen.getByRole('textbox');

        userEvent.type(digitInput, '6699');
        userEvent.tab();

        await waitFor(() => {
            const error = screen.getByText(/Length of digit code must be 6 characters./i);
            expect(error).toBeInTheDocument();
        });
    });

    it('should display error if user sends invalid OTP', async () => {
        WS.authorized.accountSecurity.mockResolvedValue({
            error: { message: "That's not the right code. Please try again.", code: 'InvalidOTP' },
        });

        renderComponent({ store_config: store });

        const digitInput = screen.getByRole('textbox');
        userEvent.type(digitInput, '786789');

        const submitButton = screen.getByRole('button');

        await waitFor(() => {
            userEvent.click(submitButton);
            const error = screen.getByText(/That's not the right code. Please try again./i);
            expect(error).toBeInTheDocument();
        });
    });

    it('should display error if code inside error object is not equal to InvalidOTP ', async () => {
        WS.authorized.accountSecurity.mockResolvedValue({
            error: { message: 'OTP verification failed', code: '' },
        });

        renderComponent({ store_config: store });

        const digitInput = screen.getByRole('textbox');
        const invalidOTP = '786789';

        userEvent.type(digitInput, invalidOTP);

        const submitButton = screen.getByRole('button', { name: /Enable/i });

        await waitFor(() => {
            userEvent.click(submitButton);
            const error = screen.getByText(/OTP verification failed/i);
            expect(error).toBeInTheDocument();
        });
    });
});
