import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import dayjs from 'dayjs';
import usePhoneNumberVerificationSetTimer from '../usePhoneNumberVerificationSetTimer';
import { StoreProvider, mockStore } from '@deriv/stores';

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
    });

    afterEach(() => {
        jest.useRealTimers();
        mock_store.ui.should_show_phone_number_otp = false;
    });

    it('should set the correct timer and title when next_attempt is provided and should_show_phone_number_otp is true', () => {
        const next_attempt = dayjs().add(65, 'seconds').unix();
        if (mock_store.client.account_settings.phone_number_verification)
            mock_store.client.account_settings.phone_number_verification.next_attempt = next_attempt;
        mock_store.ui.should_show_phone_number_otp = true;

        const { result } = renderHook(() => usePhoneNumberVerificationSetTimer(), { wrapper });

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(result.current.next_otp_request).toMatch(/\(1m\)/);
    });

    it('should set the correct timer and title when next_email_attempt is provided', () => {
        const next_email_attempt = dayjs().add(2, 'minutes').unix();
        if (mock_store.client.account_settings.phone_number_verification)
            mock_store.client.account_settings.phone_number_verification.next_email_attempt = next_email_attempt;

        const { result } = renderHook(() => usePhoneNumberVerificationSetTimer(), { wrapper });

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(result.current.next_otp_request).toMatch(/ in 2m/);
    });

    it('should set the correct timer and title when is_from_request_phone_otp is true', async () => {
        const next_email_attempt = dayjs().add(1, 'minutes').unix();
        if (mock_store.client.account_settings.phone_number_verification)
            mock_store.client.account_settings.phone_number_verification.next_email_attempt = next_email_attempt;
        const { result } = renderHook(() => usePhoneNumberVerificationSetTimer(true), { wrapper });

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(result.current.next_otp_request).toMatch(/ 1 minutes/);
    });
});
