import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { APIProvider, useSendUserOTP } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import DigitForm from '../digit-form';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useSendUserOTP: jest.fn(() => ({
        is_TwoFA_enabled: false,
        data: { account_security: { totp: { is_enabled: 0 } } },
        isLoading: false,
        isSuccess: false,
        sendUserOTP: jest.fn(() => ({ totp_action: 'disable', otp: '328746' })),
    })),
}));

const mockUseSendUserOTP = useSendUserOTP as jest.MockedFunction<typeof useSendUserOTP>;

describe('<DigitForm />', () => {
    const store = mockStore({
        client: {
            has_enabled_two_fa: false,
            is_switching: false,
            setTwoFAStatus: jest.fn(),
            setTwoFAChangedStatus: jest.fn(),
        },
        common: {
            is_language_changing: false,
        },
    });

    const renderComponent = ({ store_config = store }) => {
        render(
            <APIProvider>
                <StoreProvider store={store_config}>
                    <DigitForm />
                </StoreProvider>
            </APIProvider>
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
        const new_store_config = {
            ...store,
            client: {
                ...store.client,
                has_enabled_two_fa: true,
            },
        };

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

    it('should display error if user types invalid OTP', async () => {
        // @ts-expect-error need to come up with a way to mock the return type of useSendUserOTP
        mockUseSendUserOTP.mockReturnValue({
            error: { message: 'OTP verification failed', code: 'InvalidOTP' },
            sendUserOTP: jest.fn(),
        });

        renderComponent({ store_config: store });

        const digitInput = screen.getByRole('textbox');
        userEvent.type(digitInput, '786789');

        const submitButton = screen.getByRole('button');
        userEvent.click(submitButton);
        userEvent.tab();

        await waitFor(() => {
            const error = screen.getByText(/That's not the right code. Please try again./i);
            expect(error).toBeInTheDocument();
        });
    });

    it('should display error if error code inside response is not equal to InvalidOTP ', async () => {
        // @ts-expect-error need to come up with a way to mock the return type of useSendUserOTP
        mockUseSendUserOTP.mockReturnValue({
            error: { message: 'OTP verification failed', code: '' },
            sendUserOTP: jest.fn(),
        });

        renderComponent({ store_config: store });

        const digitInput = screen.getByRole('textbox');
        const invalidOTP = '786789';

        userEvent.type(digitInput, invalidOTP);

        const submitButton = screen.getByRole('button', { name: /Enable/i });
        userEvent.click(submitButton);
        userEvent.tab();

        await waitFor(() => {
            const error = screen.getByText(/OTP verification failed/i);
            expect(error).toBeInTheDocument();
        });
    });

    it('should call setTwoFAStatus function on call success', async () => {
        // @ts-expect-error need to come up with a way to mock the return type of sendUserOTP
        mockUseSendUserOTP.mockReturnValue({
            isSuccess: true,
            sendUserOTP: jest.fn(),
        });

        renderComponent({ store_config: store });

        expect(store.client.setTwoFAStatus).toBeCalled();
    });

    it('should call sendUserOTP with the correct arguments on button submit', async () => {
        const mockSendUserOTP = jest.fn();
        // @ts-expect-error need to come up with a way to mock the return type of sendUserOTP
        mockUseSendUserOTP.mockReturnValue({
            sendUserOTP: mockSendUserOTP,
            is_TwoFA_enabled: true,
        });

        renderComponent({ store_config: store });

        const digitInput = screen.getByRole('textbox');
        const invalidOTP = '786789';

        userEvent.type(digitInput, invalidOTP);

        const submitButton = screen.getByRole('button', { name: /Enable/i });

        userEvent.click(submitButton);

        await waitFor(() => {
            expect(mockSendUserOTP).toHaveBeenCalled();
        });
    });
});
