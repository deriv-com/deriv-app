import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useGetPhoneNumberOTP } from '@deriv/hooks';
import ConfirmPhoneNumber from '../confirm-phone-number';
import { WS } from '@deriv/shared';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useGetPhoneNumberOTP: jest.fn(() => ({
        error_message: '',
        validatePhoneNumber: jest.fn(),
        requestOnWhatsApp: jest.fn(),
        requestOnSMS: jest.fn(),
        handleError: jest.fn(),
    })),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        authorized: {
            setSettings: jest.fn(() => Promise.resolve({})),
        },
    },
}));

describe('ConfirmPhoneNumber', () => {
    const store = mockStore({
        client: {
            account_settings: {
                phone: '+0123456789',
            },
        },
        ui: {
            setShouldShowPhoneNumberOTP: jest.fn(),
        },
    });

    const mockSetOtp = jest.fn();

    beforeEach(() => {
        (WS.authorized.setSettings as jest.Mock).mockReturnValue({});
    });

    it('should render ConfirmPhoneNumber', () => {
        render(
            <StoreProvider store={store}>
                <ConfirmPhoneNumber setOtpVerification={mockSetOtp} />
            </StoreProvider>
        );
        const phone_number_textfield = screen.getByRole('textbox', { name: 'Phone number' });
        expect(screen.getByText('Confirm your phone number')).toBeInTheDocument();
        expect(phone_number_textfield).toBeInTheDocument();
        expect(phone_number_textfield).toHaveValue('+0123456789');
        expect(screen.getByRole('button', { name: 'Get code via SMS' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Get code via WhatsApp' })).toBeInTheDocument();
    });

    it('should render validatePhoneNumber function on user key pressed', () => {
        const mock_validate_phone_number = jest.fn();
        (useGetPhoneNumberOTP as jest.Mock).mockReturnValue({
            validatePhoneNumber: mock_validate_phone_number,
        });
        render(
            <StoreProvider store={store}>
                <ConfirmPhoneNumber setOtpVerification={mockSetOtp} />
            </StoreProvider>
        );
        const phone_number_textfield = screen.getByRole('textbox', { name: 'Phone number' });
        expect(screen.getByText('Confirm your phone number')).toBeInTheDocument();
        expect(phone_number_textfield).toBeInTheDocument();
        userEvent.clear(phone_number_textfield);
        userEvent.type(phone_number_textfield, '+01293291291');
        expect(mock_validate_phone_number).toHaveBeenCalled();
    });

    it('should render display given error message', () => {
        (useGetPhoneNumberOTP as jest.Mock).mockReturnValue({
            error_message: 'This is an error message',
        });
        render(
            <StoreProvider store={store}>
                <ConfirmPhoneNumber setOtpVerification={mockSetOtp} />
            </StoreProvider>
        );
        expect(screen.getByText(/This is an error message/)).toBeInTheDocument();
    });

    it('should render handleError function when WS returns error promises', async () => {
        const mock_handle_error = jest.fn();
        (WS.authorized.setSettings as jest.Mock).mockReturnValue({
            error: { code: 'SomeErrorCode', message: 'SomeErrorMessage' },
        });
        (useGetPhoneNumberOTP as jest.Mock).mockReturnValue({
            requestOnWhatsApp: jest.fn(),
            handleError: mock_handle_error,
        });

        render(
            <StoreProvider store={store}>
                <ConfirmPhoneNumber setOtpVerification={mockSetOtp} />
            </StoreProvider>
        );
        const whatsapp_btn = screen.getByRole('button', { name: 'Get code via WhatsApp' });
        await userEvent.click(whatsapp_btn);
        expect(mock_handle_error).toBeCalledTimes(1);
    });

    it('should call requestOnWhatsApp when Whatsapp button is clicked', async () => {
        const mockWhatsappButtonClick = jest.fn();

        (useGetPhoneNumberOTP as jest.Mock).mockReturnValue({
            requestOnWhatsApp: mockWhatsappButtonClick,
            handleError: jest.fn(),
        });
        render(
            <StoreProvider store={store}>
                <ConfirmPhoneNumber setOtpVerification={mockSetOtp} />
            </StoreProvider>
        );
        const whatsapp_btn = screen.getByRole('button', { name: 'Get code via WhatsApp' });
        await userEvent.click(whatsapp_btn);
        expect(mockWhatsappButtonClick).toHaveBeenCalled();
    });

    it('should call requestOnSMS when SMS button is clicked', async () => {
        const mockSmsButtonClick = jest.fn();

        (useGetPhoneNumberOTP as jest.Mock).mockReturnValue({
            requestOnSMS: mockSmsButtonClick,
            handleError: jest.fn(),
        });
        render(
            <StoreProvider store={store}>
                <ConfirmPhoneNumber setOtpVerification={mockSetOtp} />
            </StoreProvider>
        );
        const sms_btn = screen.getByRole('button', { name: 'Get code via SMS' });
        await userEvent.click(sms_btn);
        expect(mockSmsButtonClick).toHaveBeenCalled();
    });
});
