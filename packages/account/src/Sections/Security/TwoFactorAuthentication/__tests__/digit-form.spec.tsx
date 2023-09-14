import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DigitForm from '../digit-form';
import { APIProvider, useRequest } from '@deriv/api';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useRequest: jest.fn(),
}));

const mockUseRequest = useRequest as jest.MockedFunction<typeof useRequest<'account_security'>>;

describe('<DigitForm />', () => {
    beforeEach(() => {
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValue({
            error: { message: 'OTP verification failed', code: 'InvalidOTP' },
            mutate: jest.fn(),
        });
    });

    const mock_props: React.ComponentProps<typeof DigitForm> = {
        is_enabled: false,
        setTwoFAStatus: jest.fn(),
        setTwoFAChangedStatus: jest.fn(),
        is_language_changing: true,
    };

    const renderComponent = (mock = mock_props) => {
        return render(
            <APIProvider>
                <DigitForm {...mock} />
            </APIProvider>
        );
    };

    it('should render the DigitForm component', () => {
        renderComponent();

        const digit_form_label = screen.getByText(/Authentication code/i);
        expect(digit_form_label).toBeInTheDocument();
    });

    it('should change button text when user enables or disables 2FA', () => {
        const enabled_props = {
            ...mock_props,
            is_enabled: true,
        };
        renderComponent();
        const enableButton = screen.getByRole('button', { name: /Enable/i });
        expect(enableButton).toBeInTheDocument();

        renderComponent(enabled_props);
        const disableButton = screen.getByRole('button', { name: /Disable/i });
        expect(disableButton).toBeInTheDocument();
    });

    it('should display error if submits empty form', async () => {
        renderComponent();

        const nameInput = screen.getByRole('textbox');
        await userEvent.click(nameInput);

        await waitFor(() => {
            const error = screen.getByText(/Digit code is required./i);
            expect(error).toBeInTheDocument();
        });
    });

    it('should display error if user types alphanumeric characters', async () => {
        renderComponent();
        const digitInput = screen.getByRole('textbox');

        userEvent.type(digitInput, '669yi9');

        await waitFor(() => {
            const error = screen.getByText(/Digit code must only contain numbers./i);
            expect(error).toBeInTheDocument();
        });
    });

    it('should display error if user types less than 6 digits', async () => {
        renderComponent();
        const digitInput = screen.getByRole('textbox');

        userEvent.type(digitInput, '6699');

        await waitFor(() => {
            const error = screen.getByText(/Length of digit code must be 6 characters./i);
            expect(error).toBeInTheDocument();
        });
    });

    it('should display error if user types invalid OTP', async () => {
        renderComponent();
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
        renderComponent();
        const submitButton = screen.getByRole('button', { name: /Enable/i });
        expect(submitButton).toBeDisabled();

        const digitInput = screen.getByRole('textbox');
        userEvent.type(digitInput, '669yi9');
        await waitFor(() => {
            expect(submitButton).toBeDisabled();
        });
    });

    it('should display error if error code inside response is not equal to InvalidOTP ', async () => {
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValue({
            error: { message: 'OTP verification failed', code: '' },
            mutate: jest.fn(),
        });

        renderComponent();

        const digitInput = screen.getByRole('textbox');
        const invalidOTP = '786789';

        userEvent.type(digitInput, invalidOTP);

        const submitButton = screen.getByRole('button', { name: /Enable/i });
        userEvent.click(submitButton);

        await waitFor(() => {
            const error = screen.getByText(/OTP verification failed/i);
            expect(error).toBeInTheDocument();
        });
    });

    it('should not display error if response object does not contain error object', async () => {
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValue({
            data: { account_security: { totp: { is_enabled: 0 } } },
            mutate: jest.fn(),
        });

        renderComponent();

        const digitInput = screen.getByRole('textbox');
        const invalidOTP = '786789';

        userEvent.type(digitInput, invalidOTP);

        const submitButton = screen.getByRole('button', { name: /Enable/i });
        userEvent.click(submitButton);

        await waitFor(() => {
            const error = screen.queryByText(/That's not the right code. Please try again./i);
            expect(error).not.toBeInTheDocument();
        });
    });
});
