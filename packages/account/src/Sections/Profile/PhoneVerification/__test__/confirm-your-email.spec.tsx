import { render, screen } from '@testing-library/react';
import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import ConfirmYourEmail from '../confirm-your-email';

describe('ConfirmPhoneNumber', () => {
    const store = mockStore({
        client: {
            account_settings: {
                email: 'johndoe@regentmarkets.com',
            },
        },
    });

    it('should render ConfirmPhoneNumber', () => {
        render(
            <StoreProvider store={store}>
                <ConfirmYourEmail />
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
});
