import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VerifyButton } from '../verify-button';
import { StoreProvider, mockStore } from '@deriv/stores';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { routes } from '@deriv/shared';
import { usePhoneNumberVerificationSetTimer } from '@deriv/hooks';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    usePhoneNumberVerificationSetTimer: jest.fn(),
}));

describe('VerifyButton', () => {
    beforeEach(() => {
        (usePhoneNumberVerificationSetTimer as jest.Mock).mockReturnValue({ next_otp_request: '' });
    });
    const history = createBrowserHistory();
    const renderWithRouter = (component: React.ReactElement) => {
        return render(<Router history={history}>{component}</Router>);
    };

    const mock_store = mockStore({
        client: {
            account_settings: {
                phone_number_verification: {
                    verified: 0,
                },
            },
        },
    });

    it('should render Verify Button', () => {
        renderWithRouter(
            <StoreProvider store={mock_store}>
                <VerifyButton />
            </StoreProvider>
        );
        expect(screen.getByText('Verify')).toBeInTheDocument();
    });

    it('should render Verify Button with countdown timer return from usePhoneNumberSetTimer and should have disabled class', () => {
        (usePhoneNumberVerificationSetTimer as jest.Mock).mockReturnValue({ next_otp_request: 'in 60s' });
        renderWithRouter(
            <StoreProvider store={mock_store}>
                <VerifyButton />
            </StoreProvider>
        );
        expect(screen.getByText('Verify in 60s')).toBeInTheDocument();
        expect(screen.getByText('Verify in 60s')).toHaveClass(
            'account-form__phone-verification-btn--not-verified--disabled'
        );
    });

    it('should redirect user to phone-verification page when clicked on Verify Button', () => {
        renderWithRouter(
            <StoreProvider store={mock_store}>
                <VerifyButton />
            </StoreProvider>
        );
        const verifyButton = screen.getByText('Verify');
        userEvent.click(verifyButton);
        expect(history.location.pathname).toBe(routes.phone_verification);
    });

    it('should render Verified text', () => {
        if (mock_store.client.account_settings.phone_number_verification)
            mock_store.client.account_settings.phone_number_verification.verified = 1;
        renderWithRouter(
            <StoreProvider store={mock_store}>
                <VerifyButton />
            </StoreProvider>
        );
        expect(screen.getByText('Verified')).toBeInTheDocument();
        expect(screen.getByTestId('dt_phone_verification_popover')).toBeInTheDocument();
    });

    it('should render popover text when popover is clicked', () => {
        if (mock_store.client.account_settings.phone_number_verification)
            mock_store.client.account_settings.phone_number_verification.verified = 1;
        renderWithRouter(
            <StoreProvider store={mock_store}>
                <VerifyButton />
            </StoreProvider>
        );
        const popover = screen.getByTestId('dt_phone_verification_popover');
        userEvent.click(popover);
        expect(screen.getByText(/To change your verified phone number, contact us via/)).toBeInTheDocument();
        expect(screen.getByText(/live chat/)).toBeInTheDocument();
    });

    it('should render live chat window when live chat is clicked', () => {
        if (mock_store.client.account_settings.phone_number_verification)
            mock_store.client.account_settings.phone_number_verification.verified = 1;
        window.LC_API = {
            open_chat_window: jest.fn(),
            on_chat_ended: jest.fn(),
        };

        renderWithRouter(
            <StoreProvider store={mock_store}>
                <VerifyButton />
            </StoreProvider>
        );
        const popover = screen.getByTestId('dt_phone_verification_popover');
        userEvent.click(popover);
        const livechat = screen.getByText(/live chat/);
        userEvent.click(livechat);
        expect(window.LC_API.open_chat_window).toHaveBeenCalled();
    });
});
