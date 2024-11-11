import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    useGrowthbookGetFeatureValue,
    usePhoneNumberVerificationSetTimer,
    useRequestPhoneNumberOTP,
    useSettings,
} from '@deriv/hooks';
import { StoreProvider, mockStore } from '@deriv/stores';
import ConfirmPhoneNumber from '../confirm-phone-number';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useRequestPhoneNumberOTP: jest.fn(() => ({
        error_message: '',
        requestOnWhatsApp: jest.fn(),
        requestOnSMS: jest.fn(),
        setErrorMessage: jest.fn(),
        setUsersPhoneNumber: jest.fn(),
        setIsDisabledRequestButton: jest.fn(),
    })),
    useGrowthbookGetFeatureValue: jest.fn(),
    useSettings: jest.fn(() => ({
        data: {},
        invalidate: jest.fn(),
    })),
    useGetPhoneNumberList: jest.fn(() => ({
        formatted_countries_list: [
            { phone_code: '+60', short_code: 'MY', name: 'Malaysia', carriers: ['sms', 'whatsapp'] },
            { phone_code: '+55', short_code: 'BR', name: 'Brazil', carriers: ['whatsapp'] },
        ],
        short_code_selected: 'my',
        selected_phone_code: '+60',
        selected_country_list: {
            carriers: ['sms', 'whatsapp'],
        },
    })),
    usePhoneNumberVerificationSetTimer: jest.fn(() => ({
        next_phone_otp_request_timer: undefined,
        is_phone_otp_timer_loading: false,
    })),
}));

describe('ConfirmPhoneNumber', () => {
    const store = mockStore({
        ui: {
            setShouldShowPhoneNumberOTP: jest.fn(),
        },
    });

    const renderComponent = () => {
        return render(
            <StoreProvider store={store}>
                <ConfirmPhoneNumber setOtpVerification={mockSetOtp} />
            </StoreProvider>
        );
    };

    beforeEach(() => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([false]);
    });

    const mockSetOtp = jest.fn();
    const whatsapp_button_text = 'Get code via WhatsApp';
    const sms_button_text = 'Get code via SMS';

    it('should render ConfirmPhoneNumber', () => {
        (useSettings as jest.Mock).mockReturnValue({
            data: { phone: '+0123456789' },
        });
        renderComponent();
        const phone_number_textfield = screen.getByRole('textbox', { name: 'Phone number' });
        expect(screen.getByText('Step 2 of 3: Confirm your phone number')).toBeInTheDocument();
        expect(phone_number_textfield).toBeInTheDocument();
        expect(phone_number_textfield).toHaveValue('0123456789');
        expect(screen.getByRole('button', { name: sms_button_text })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: whatsapp_button_text })).toBeInTheDocument();
    });

    it('should call setErrorMessage when the user presses a key', async () => {
        const mock_set_error_message = jest.fn();
        const mock_set_is_disabled_request_button = jest.fn();
        (useRequestPhoneNumberOTP as jest.Mock).mockReturnValue({
            setErrorMessage: mock_set_error_message,
            setIsDisabledRequestButton: mock_set_is_disabled_request_button,
        });
        renderComponent();
        const phone_number_textfield = screen.getByRole('textbox', { name: 'Phone number' });
        expect(screen.getByText('Step 2 of 3: Confirm your phone number')).toBeInTheDocument();
        expect(phone_number_textfield).toBeInTheDocument();
        userEvent.clear(phone_number_textfield);
        userEvent.type(phone_number_textfield, '+01293291291');
        await waitFor(() => {
            expect(mock_set_error_message).toHaveBeenCalled();
            expect(mock_set_is_disabled_request_button).toHaveBeenCalled();
        });
    });

    it('should display given error message', () => {
        (useRequestPhoneNumberOTP as jest.Mock).mockReturnValue({
            error_message: 'This is an error message',
        });
        renderComponent();
        expect(screen.getByText(/This is an error message/)).toBeInTheDocument();
    });

    it('should render handleError function when WS returns error promises', async () => {
        const mock_handle_error = jest.fn().mockResolvedValue({ error: null });
        (useRequestPhoneNumberOTP as jest.Mock).mockReturnValue({
            requestOnWhatsApp: jest.fn(),
            setUsersPhoneNumber: mock_handle_error,
        });

        renderComponent();
        const whatsapp_btn = screen.getByRole('button', { name: whatsapp_button_text });
        userEvent.click(whatsapp_btn);
        await waitFor(() => {
            expect(mock_handle_error).toBeCalledTimes(1);
        });
    });

    it('should call requestOnWhatsApp when Whatsapp button is clicked', async () => {
        const mockWhatsappButtonClick = jest.fn();

        (useRequestPhoneNumberOTP as jest.Mock).mockReturnValue({
            requestOnWhatsApp: mockWhatsappButtonClick,
            setUsersPhoneNumber: jest.fn().mockResolvedValue({ error: null }),
        });
        renderComponent();
        const whatsapp_btn = screen.getByRole('button', { name: whatsapp_button_text });
        userEvent.click(whatsapp_btn);
        await waitFor(() => {
            expect(mockWhatsappButtonClick).toHaveBeenCalled();
        });
    });

    it('should call requestOnSMS when SMS button is clicked', async () => {
        const mockSmsButtonClick = jest.fn();

        (useRequestPhoneNumberOTP as jest.Mock).mockReturnValue({
            requestOnSMS: mockSmsButtonClick,
            setUsersPhoneNumber: jest.fn().mockResolvedValue({ error: null }),
        });
        renderComponent();
        const sms_btn = screen.getByRole('button', { name: sms_button_text });
        userEvent.click(sms_btn);
        await waitFor(() => {
            expect(mockSmsButtonClick).toHaveBeenCalled();
        });
    });

    it('should make both buttons disabled if next_otp_request text is provided', async () => {
        (usePhoneNumberVerificationSetTimer as jest.Mock).mockReturnValue({ next_phone_otp_request_timer: 60 });
        renderComponent();
        const sms_btn = screen.getByRole('button', { name: sms_button_text });
        const whatsapp_btn = screen.getByRole('button', { name: whatsapp_button_text });
        expect(sms_btn).toBeDisabled();
        expect(whatsapp_btn).toBeDisabled();
    });

    it('should get snackbar text when next_otp_request text is provided', async () => {
        (usePhoneNumberVerificationSetTimer as jest.Mock).mockReturnValue({ next_phone_otp_request_timer: 60 });
        renderComponent();
        expect(screen.getByText(/Request new code in 1 minute./)).toBeInTheDocument();
    });

    it('should render country code dropdown if isCountryCodeDropdownEnabled is true', () => {
        (useSettings as jest.Mock).mockReturnValue({
            data: { phone: '123456789', calling_country_code: '+60' },
        });
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([true]);
        renderComponent();
        const phone_number_textfield = screen.getByRole('textbox', { name: 'Phone number' });
        expect(phone_number_textfield).toBeInTheDocument();
        expect(phone_number_textfield).toHaveValue('123456789');
        expect(screen.getByText('+60')).toBeInTheDocument();
        expect(screen.getByText('Code')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: sms_button_text })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: whatsapp_button_text })).toBeInTheDocument();
    });

    it('should render list of countries when clicking on code dropdown', () => {
        (useSettings as jest.Mock).mockReturnValue({
            data: { phone: '123456789', calling_country_code: '+60' },
        });
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([true]);
        renderComponent();
        const code_dropdown = screen.getByText('Code');
        expect(code_dropdown).toBeInTheDocument();
        userEvent.click(code_dropdown);
        expect(screen.getByText('Malaysia (+60)')).toBeInTheDocument();
        expect(screen.getByText('Brazil (+55)')).toBeInTheDocument();
    });

    it('should hide carriers based on selected country', () => {
        (useSettings as jest.Mock).mockReturnValue({
            data: { phone: '123456789', calling_country_code: '+60' },
        });
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([true]);
        renderComponent();
        const code_dropdown = screen.getByText('Code');
        expect(code_dropdown).toBeInTheDocument();
        userEvent.click(code_dropdown);
        const country_brazil = screen.getByText('Brazil (+55)');
        expect(country_brazil).toBeInTheDocument();
        userEvent.click(country_brazil);
        expect(screen.queryByRole('button', { name: sms_button_text })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: whatsapp_button_text })).toBeInTheDocument();
    });
});
