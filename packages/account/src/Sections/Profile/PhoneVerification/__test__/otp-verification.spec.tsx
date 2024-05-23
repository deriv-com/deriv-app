import { render, screen } from '@testing-library/react';
import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import OTPVerification from '../otp-verification';
import { useGetEmailVerificationOTP } from '@deriv/hooks';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useGetEmailVerificationOTP: jest.fn(() => ({
        requestEmailVerificationOTP: jest.fn(),
    })),
}));

describe('ConfirmPhoneNumber', () => {
    const store = mockStore({
        client: {
            email: 'johndoe@regentmarkets.com',
        },
        ui: {
            should_show_phone_number_otp: false,
        },
    });
    let phone_verification_type = 'sms';
    const mockSetOtpVerification = jest.fn();
    const mockRequestEmailVerificationOTP = jest.fn();
    const renderComponent = () => {
        render(
            <StoreProvider store={store}>
                <OTPVerification
                    phone_verification_type={phone_verification_type}
                    setOtpVerification={mockSetOtpVerification}
                />
            </StoreProvider>
        );
    };

    it('should render ConfirmYourEmail in OTP Verification', () => {
        (useGetEmailVerificationOTP as jest.Mock).mockReturnValueOnce({
            requestEmailVerificationOTP: mockRequestEmailVerificationOTP,
        });
        renderComponent();
        expect(screen.getByText(/Confirm it's you/)).toBeInTheDocument();
        expect(screen.getByText(/We've sent a verification code to/)).toBeInTheDocument();
        expect(screen.getByText('johndoe@regentmarkets.com')).toBeInTheDocument();
        expect(
            screen.getByText(/Enter the code or click the link in the email to verify that the account belongs to you./)
        ).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /OTP code/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Resend code/ })).toBeInTheDocument();
        expect(mockRequestEmailVerificationOTP).toHaveBeenCalled();
    });

    it('should render Verify your number in OTP Verification', () => {
        store.ui.should_show_phone_number_otp = true;
        renderComponent();
        expect(screen.getByText(/Verify your number/)).toBeInTheDocument();
        expect(screen.getByText(/Enter the 6-digit code sent to you via SMS at :/)).toBeInTheDocument();
    });

    it('should render whatsapp when phone_verification_type is whatsapp', () => {
        store.ui.should_show_phone_number_otp = true;
        phone_verification_type = 'whatsapp';
        renderComponent();
        expect(screen.getByText(/WhatsApp/)).toBeInTheDocument();
    });
});
