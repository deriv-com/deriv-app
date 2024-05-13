import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhoneVerificationPage from '../phone-verification-page';

jest.mock('../otp-verification.tsx', () => jest.fn(() => <div>Confirm Your Email</div>));
jest.mock('../confirm-phone-number.tsx', () => jest.fn(() => <div>Confirm Phone Number</div>));
jest.mock('../cancel-phone-verification-modal', () => jest.fn(() => <div>Cancel Phone Verification Modal</div>));
jest.mock('../phone-number-verified-modal', () => jest.fn(() => <div>Phone Number Verified Modal</div>));

describe('ConfirmPhoneNumber', () => {
    it('should render ConfirmPhoneNumber', () => {
        render(<PhoneVerificationPage />);
        expect(screen.getByText(/Phone number verification/)).toBeInTheDocument();
        expect(screen.getByText(/Confirm Your Email/)).toBeInTheDocument();
    });

    it('should display cancel phone verification modal when back button is clicked', () => {
        render(<PhoneVerificationPage />);
        const backButton = screen.getByTestId('dt_phone_verification_back_btn');
        userEvent.click(backButton);
        expect(screen.getByText(/Cancel Phone Verification Modal/)).toBeInTheDocument();
    });
});
