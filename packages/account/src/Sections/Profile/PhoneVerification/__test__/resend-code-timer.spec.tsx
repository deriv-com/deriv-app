import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResendCodeTimer from '../resend-code-timer';
import { StoreProvider, mockStore } from '@deriv/stores';
import { usePhoneNumberVerificationSetTimer, useVerifyEmail } from '@deriv/hooks';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useVerifyEmail: jest.fn(() => ({
        send: jest.fn(),
        is_success: false,
    })),
    useSettings: jest.fn(() => ({
        data: {
            phone_number_verification: {
                next_email_attempt: null,
                next_attempt: null,
            },
        },
    })),
    usePhoneNumberVerificationSetTimer: jest.fn(() => ({
        next_otp_request: '',
    })),
}));

describe('ConfirmPhoneNumber', () => {
    afterEach(() => {
        jest.clearAllMocks();
        (usePhoneNumberVerificationSetTimer as jest.Mock).mockReturnValue({ next_otp_request: '' });
    });

    const mock_store = mockStore({});
    it('should enable button if usePhoneNumberVerificationSetTimer did not return next_otp_request', async () => {
        render(
            <StoreProvider store={mock_store}>
                <ResendCodeTimer
                    is_button_disabled={false}
                    reInitializeGetSettings={jest.fn}
                    setIsButtonDisabled={jest.fn()}
                    should_show_resend_code_button
                    setShouldShowDidntGetTheCodeModal={jest.fn()}
                />
            </StoreProvider>
        );

        expect(screen.queryByRole('button', { name: 'Resend code' })).toBeEnabled;
    });

    it('should disable button if usePhoneNumberVerificationSetTimer returns next_otp_request', async () => {
        (usePhoneNumberVerificationSetTimer as jest.Mock).mockReturnValue({ next_otp_request: 'in 59s' });
        render(
            <StoreProvider store={mock_store}>
                <ResendCodeTimer
                    is_button_disabled={false}
                    reInitializeGetSettings={jest.fn}
                    setIsButtonDisabled={jest.fn()}
                    should_show_resend_code_button
                    setShouldShowDidntGetTheCodeModal={jest.fn()}
                />
            </StoreProvider>
        );

        expect(screen.queryByRole('button', { name: 'Resend code in 59s' })).toBeDisabled;
    });

    it('should trigger mockSend when send button is clicked', () => {
        const mockSend = jest.fn();
        (useVerifyEmail as jest.Mock).mockReturnValue({
            send: mockSend,
        });
        render(
            <StoreProvider store={mock_store}>
                <ResendCodeTimer
                    is_button_disabled={false}
                    reInitializeGetSettings={jest.fn}
                    setIsButtonDisabled={jest.fn()}
                    should_show_resend_code_button={true}
                    setShouldShowDidntGetTheCodeModal={jest.fn()}
                />
            </StoreProvider>
        );
        const resend_button = screen.getByRole('button', { name: 'Resend code' });
        expect(resend_button).toBeEnabled();

        userEvent.click(resend_button);
        expect(mockSend).toBeCalled();
    });

    it('should display Didn’t get the code? should_show_resend_code_button is false', () => {
        render(
            <StoreProvider store={mock_store}>
                <ResendCodeTimer
                    is_button_disabled={false}
                    reInitializeGetSettings={jest.fn}
                    setIsButtonDisabled={jest.fn()}
                    should_show_resend_code_button={false}
                    setShouldShowDidntGetTheCodeModal={jest.fn()}
                />
            </StoreProvider>
        );
        const resend_button = screen.getByRole('button', { name: "Didn't get the code?" });
        expect(resend_button).toBeInTheDocument();
    });

    it('should display Didn’t get the code? (60s) when usePhoneNumberSetTimer returns (60s)', () => {
        (usePhoneNumberVerificationSetTimer as jest.Mock).mockReturnValue({ next_otp_request: ' (60s)' });
        render(
            <StoreProvider store={mock_store}>
                <ResendCodeTimer
                    is_button_disabled={false}
                    reInitializeGetSettings={jest.fn}
                    setIsButtonDisabled={jest.fn()}
                    should_show_resend_code_button={false}
                    setShouldShowDidntGetTheCodeModal={jest.fn()}
                />
            </StoreProvider>
        );
        const resend_button = screen.getByRole('button', { name: "Didn't get the code? (60s)" });
        expect(resend_button).toBeInTheDocument();
    });

    it('should trigger setShouldShowDidntGetTheCodeModal when Didn`t get the code is clicked', () => {
        const mockSetShouldShowDidntGetTheCodeModal = jest.fn();
        render(
            <StoreProvider store={mock_store}>
                <ResendCodeTimer
                    is_button_disabled={false}
                    reInitializeGetSettings={jest.fn}
                    setIsButtonDisabled={jest.fn()}
                    should_show_resend_code_button={false}
                    setShouldShowDidntGetTheCodeModal={mockSetShouldShowDidntGetTheCodeModal}
                />
            </StoreProvider>
        );
        const resend_button_after = screen.getByRole('button', { name: "Didn't get the code?" });
        userEvent.click(resend_button_after);
        expect(mockSetShouldShowDidntGetTheCodeModal).toHaveBeenCalled();
    });
});
