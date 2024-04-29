import { render, screen } from '@testing-library/react';
import React from 'react';
import PhoneVerificationPage from '../phone-verification-page';

jest.mock('../confirm-your-email.tsx', () => jest.fn(() => <div>Confirm Your Email</div>));
jest.mock('../confirm-phone-number.tsx', () => jest.fn(() => <div>Confirm Phone Number</div>));

describe('ConfirmPhoneNumber', () => {
    it('should render ConfirmPhoneNumber', () => {
        render(<PhoneVerificationPage />);
        expect(screen.getByText(/Phone number verification/)).toBeInTheDocument();
        expect(screen.getByText(/Confirm Your Email/)).toBeInTheDocument();
    });
});
