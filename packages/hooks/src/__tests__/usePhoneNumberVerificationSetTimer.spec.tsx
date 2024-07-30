import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import usePhoneNumberVerificationSetTimer from '../usePhoneNumberVerificationSetTimer';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useServerTime } from '@deriv/api';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useServerTime: jest.fn(),
}));

const mock_store = mockStore({
    client: {
        account_settings: {
            phone_number_verification: {
                next_email_attempt: undefined,
                next_attempt: undefined,
            },
        },
    },
    ui: {
        should_show_phone_number_otp: false,
    },
});

describe('usePhoneNumberVerificationSetTimer', () => {
    const wrapper = ({ children }: { children: JSX.Element }) => (
        <StoreProvider store={mock_store}>{children}</StoreProvider>
    );
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        (useServerTime as jest.Mock).mockReturnValue({
            data: {
                time: 1620000000,
            },
        });
    });

    afterEach(() => {
        jest.useRealTimers();
        mock_store.ui.should_show_phone_number_otp = false;
    });

    it('should set the correct timer and title when next_attempt is provided and should_show_phone_number_otp is true', () => {
        if (mock_store.client.account_settings.phone_number_verification)
            mock_store.client.account_settings.phone_number_verification.next_attempt = 1620000061;
        mock_store.ui.should_show_phone_number_otp = true;

        const { result } = renderHook(() => usePhoneNumberVerificationSetTimer(), { wrapper });

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(result.current.next_otp_request).toMatch(/\(1m\)/);

        act(() => {
            jest.advanceTimersByTime(2000);
        });
        expect(result.current.next_otp_request).toMatch(/\(59s\)/);
    });

    it('should set the correct timer and title when next_email_attempt is provided', () => {
        if (mock_store.client.account_settings.phone_number_verification)
            mock_store.client.account_settings.phone_number_verification.next_email_attempt = 1620000120;

        const { result } = renderHook(() => usePhoneNumberVerificationSetTimer(), { wrapper });

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(result.current.next_otp_request).toMatch(/ in 2m/);
    });

    it('should set the correct timer and title when is_from_request_phone_otp is true', async () => {
        if (mock_store.client.account_settings.phone_number_verification)
            mock_store.client.account_settings.phone_number_verification.next_email_attempt = 1620000061;
        const { result } = renderHook(() => usePhoneNumberVerificationSetTimer(true), { wrapper });

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(result.current.next_otp_request).toMatch(/ 1 minutes/);

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(result.current.next_otp_request).toMatch(/ 60 seconds/);
    });
});
