import { act, render, screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import ResendCodeTimer from '../resend-code-timer';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useGetEmailVerificationOTP } from '@deriv/hooks';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useGetEmailVerificationOTP: jest.fn(() => ({
        requestEmailVerificationOTP: jest.fn(),
    })),
}));

describe('ConfirmPhoneNumber', () => {
    const mockRequestEmailVerificationOTP = jest.fn();
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    const mock_store = mockStore({});

    it('should disable button after its clicked', () => {
        render(
            <StoreProvider store={mock_store}>
                <ResendCodeTimer
                    resend_code_text='Resend code'
                    count_from={60}
                    setStartTimer={jest.fn()}
                    start_timer
                    setShouldShowDidntGetTheCodeModal={jest.fn()}
                />
            </StoreProvider>
        );
        const resend_button = screen.getByRole('button', { name: 'Resend code in 60s' });

        userEvent.click(resend_button);

        expect(resend_button).toBeDisabled();
    });

    it('should trigger requestEmailVerificationOTP button after its clicked', () => {
        (useGetEmailVerificationOTP as jest.Mock).mockReturnValueOnce({
            requestEmailVerificationOTP: mockRequestEmailVerificationOTP,
        });
        const mockSetStartTimer = jest.fn();
        render(
            <StoreProvider store={mock_store}>
                <ResendCodeTimer
                    resend_code_text='Resend code'
                    count_from={0}
                    setStartTimer={mockSetStartTimer}
                    start_timer
                    setShouldShowDidntGetTheCodeModal={jest.fn()}
                />
            </StoreProvider>
        );
        const resend_button = screen.getByRole('button', { name: 'Resend code' });

        userEvent.click(resend_button);
        expect(mockSetStartTimer).toHaveBeenCalled();
    });

    it('should display correct title if value of resend_code_text is Resend code', () => {
        render(
            <StoreProvider store={mock_store}>
                <ResendCodeTimer
                    resend_code_text='Resend code'
                    count_from={60}
                    setStartTimer={jest.fn()}
                    start_timer
                    setShouldShowDidntGetTheCodeModal={jest.fn()}
                />
            </StoreProvider>
        );
        const resend_button = screen.getByRole('button', { name: 'Resend code in 60s' });
        expect(resend_button).toBeInTheDocument();
    });

    it('should display correct title if value of resend_code_text is Didn’t get the code?', () => {
        render(
            <StoreProvider store={mock_store}>
                <ResendCodeTimer
                    resend_code_text='Didn’t get the code?'
                    count_from={60}
                    setStartTimer={jest.fn()}
                    start_timer
                    setShouldShowDidntGetTheCodeModal={jest.fn()}
                />
            </StoreProvider>
        );
        const resend_button = screen.getByRole('button', { name: 'Didn’t get the code? (60s)' });
        expect(resend_button).toBeInTheDocument();
    });

    it('should check if title changes when timer expires and value of resend_code_text is Didn’t get the code?', () => {
        render(
            <StoreProvider store={mock_store}>
                <ResendCodeTimer
                    resend_code_text='Didn’t get the code?'
                    count_from={6}
                    setStartTimer={jest.fn()}
                    start_timer
                    setShouldShowDidntGetTheCodeModal={jest.fn()}
                />
            </StoreProvider>
        );
        const resend_button = screen.getByRole('button', { name: 'Didn’t get the code? (6s)' });
        userEvent.click(resend_button);

        act(() => {
            jest.advanceTimersByTime(6000); // Advance timers by 6 seconds
        });

        const resend_button_after = screen.getByRole('button', { name: 'Didn’t get the code?' });
        expect(resend_button_after).toBeInTheDocument();
    });

    it('should trigger setShouldShowDidntGetTheCodeModal when Didn`t get the code is clicked', () => {
        const setShouldShowDidntGetTheCodeModal = jest.fn();
        render(
            <StoreProvider store={mock_store}>
                <ResendCodeTimer
                    resend_code_text='Didn’t get the code?'
                    count_from={6}
                    setStartTimer={jest.fn()}
                    start_timer={false}
                    setShouldShowDidntGetTheCodeModal={setShouldShowDidntGetTheCodeModal}
                />
            </StoreProvider>
        );
        const resend_button_after = screen.getByRole('button', { name: 'Didn’t get the code?' });
        userEvent.click(resend_button_after);
        expect(setShouldShowDidntGetTheCodeModal).toHaveBeenCalled();
    });

    it('should check if title displays countdown time when timer starts and value of resend_code_text is Didn’t get the code?', async () => {
        render(
            <StoreProvider store={mock_store}>
                <ResendCodeTimer
                    resend_code_text='Didn’t get the code?'
                    count_from={6}
                    setStartTimer={jest.fn()}
                    start_timer
                    setShouldShowDidntGetTheCodeModal={jest.fn()}
                />
            </StoreProvider>
        );
        expect(screen.getByRole('button', { name: 'Didn’t get the code? (6s)' })).toBeInTheDocument();
        jest.advanceTimersByTime(3000);
        const updated_resend_button = screen.getByRole('button', { name: 'Didn’t get the code? (4s)' });
        expect(updated_resend_button).toBeInTheDocument();
    });

    it('should check if title changes when timer expires and value of resend_code_text is Resend code', () => {
        render(
            <StoreProvider store={mock_store}>
                <ResendCodeTimer
                    resend_code_text='Resend code'
                    count_from={6}
                    setStartTimer={jest.fn()}
                    start_timer
                    setShouldShowDidntGetTheCodeModal={jest.fn()}
                />
            </StoreProvider>
        );
        const resend_button = screen.getByRole('button', { name: 'Resend code in 6s' });
        userEvent.click(resend_button);

        act(() => {
            jest.advanceTimersByTime(6000);
        });

        const resend_button_after = screen.getByRole('button', { name: 'Resend code' });
        expect(resend_button_after).toBeInTheDocument();
    });

    it('should check if title displays countdown time when timer starts and value of resend_code_text is Resend code', async () => {
        render(
            <StoreProvider store={mock_store}>
                <ResendCodeTimer
                    resend_code_text='Resend code'
                    count_from={6}
                    setStartTimer={jest.fn()}
                    start_timer
                    setShouldShowDidntGetTheCodeModal={jest.fn()}
                />
            </StoreProvider>
        );
        expect(screen.getByRole('button', { name: 'Resend code in 6s' })).toBeInTheDocument();
        jest.advanceTimersByTime(3000);
        const updated_resend_button = screen.getByRole('button', { name: 'Resend code in 4s' });
        expect(updated_resend_button).toBeInTheDocument();
    });
});
