import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VerifyButton } from '../verify-button';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('VerifyButton', () => {
    const mock_store = mockStore({
        client: {
            account_settings: {
                phone_number_verification: {
                    verified: false,
                },
            },
        },
    });
    it('should render Verify Button', () => {
        render(
            <StoreProvider store={mock_store}>
                <VerifyButton />
            </StoreProvider>
        );
        expect(screen.getByText('Verify')).toBeInTheDocument();
    });

    it('should render Verified text', () => {
        mock_store.client.account_settings.phone_number_verification.verified = true;
        render(
            <StoreProvider store={mock_store}>
                <VerifyButton />
            </StoreProvider>
        );
        expect(screen.getByText('Verified')).toBeInTheDocument();
        expect(screen.getByTestId('dt_phone_verification_popover')).toBeInTheDocument();
    });

    it('should render popover text when popover is clicked', () => {
        mock_store.client.account_settings.phone_number_verification.verified = true;
        render(
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
        mock_store.client.account_settings.phone_number_verification.verified = true;
        window.LC_API = {
            open_chat_window: jest.fn(),
            on_chat_ended: jest.fn(),
        };

        render(
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
