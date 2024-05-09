import { render, screen } from '@testing-library/react';
import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import OTPVerification from '../otp-verification';
import userEvent from '@testing-library/user-event';

describe('ConfirmPhoneNumber', () => {
    const store = mockStore({
        client: {
            account_settings: {
                email: 'johndoe@regentmarkets.com',
            },
        },
        ui: {
            should_show_phone_number_otp: false,
        },
    });
    let phone_verification_type = 'sms';

    it('should render ConfirmYourEmail in OTP Verification', () => {
        render(
            <StoreProvider store={store}>
                <OTPVerification phone_verification_type={phone_verification_type} />
            </StoreProvider>
        );
        expect(screen.getByText(/Confirm it's you/)).toBeInTheDocument();
        expect(screen.getByText(/We've sent a verification code to/)).toBeInTheDocument();
        expect(screen.getByText('johndoe@regentmarkets.com')).toBeInTheDocument();
        expect(
            screen.getByText(/Enter the code or click the link in the email to verify that the account belongs to you./)
        ).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /OTP code/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Resend code/ })).toBeInTheDocument();
    });

    it('should disable button when Resend code is clicked', () => {
        render(
            <StoreProvider store={store}>
                <OTPVerification phone_verification_type={phone_verification_type} />
            </StoreProvider>
        );
        const resend_button = screen.getByRole('button', { name: 'Resend code' });

        userEvent.click(resend_button);

        expect(resend_button).toBeDisabled();
    });

    it('should render Verify your number in OTP Verification', () => {
        store.ui.should_show_phone_number_otp = true;
        render(
            <StoreProvider store={store}>
                <OTPVerification phone_verification_type={phone_verification_type} />
            </StoreProvider>
        );
        expect(screen.getByText(/Verify your number/)).toBeInTheDocument();
        expect(screen.getByText(/Enter the 6-digit code sent to you via SMS at :/)).toBeInTheDocument();
    });

    it('should render whatsapp when phone_verification_type is whatsapp', () => {
        store.ui.should_show_phone_number_otp = true;
        phone_verification_type = 'whatsapp';
        render(
            <StoreProvider store={store}>
                <OTPVerification phone_verification_type={phone_verification_type} />
            </StoreProvider>
        );
        expect(screen.getByText(/WhatsApp/)).toBeInTheDocument();
    });
});
