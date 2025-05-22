import { renderHook } from '@testing-library/react-hooks';

import usePhoneNumberVerificationSessionTimer from '../usePhoneNumberVerificationSessionTimer';
import useSettings from '../useSettings';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        send: jest.fn().mockResolvedValue({ time: 1620000000 }),
    },
}));

jest.mock('../useSettings');

describe('usePhoneNumberVerificationSetTimer', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ legacyFakeTimers: true });
        (useSettings as jest.Mock).mockReturnValue({
            data: {
                phone_number_verification: { session_timestamp: undefined },
            },
        });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should set should_show_session_timeout_modal to true if session_timestap is same with WS response time', async () => {
        (useSettings as jest.Mock).mockReturnValue({
            data: {
                phone_number_verification: { session_timestamp: 1620000000 },
            },
        });

        const { result, waitForNextUpdate } = renderHook(() => usePhoneNumberVerificationSessionTimer());

        expect(result.current.should_show_session_timeout_modal).toBe(false);

        await waitForNextUpdate();

        expect(result.current.should_show_session_timeout_modal).toBe(true);
    });

    it('should set should_show_session_timeout_modal to false if session_timestap more than WS response time', async () => {
        (useSettings as jest.Mock).mockReturnValue({
            data: {
                phone_number_verification: { session_timestamp: 1620000003 },
            },
        });

        const { result, waitForNextUpdate } = renderHook(() => usePhoneNumberVerificationSessionTimer());

        expect(result.current.should_show_session_timeout_modal).toBe(false);

        await waitForNextUpdate();

        expect(result.current.should_show_session_timeout_modal).toBe(false);
    });

    it('should set formatted_time value to be 00:00 if the session_timestamp has no difference', async () => {
        (useSettings as jest.Mock).mockReturnValue({
            data: {
                phone_number_verification: { session_timestamp: 1620000000 },
            },
        });

        const { result, waitForNextUpdate } = renderHook(() => usePhoneNumberVerificationSessionTimer());

        await waitForNextUpdate();

        expect(result.current.formatted_time).toBe('00:00');
    });

    it('should set formatted_time value if the session_timestamp has any value', async () => {
        (useSettings as jest.Mock).mockReturnValue({
            data: {
                phone_number_verification: { session_timestamp: 1620000003 },
            },
        });

        const { result, waitForNextUpdate } = renderHook(() => usePhoneNumberVerificationSessionTimer());

        await waitForNextUpdate();

        expect(result.current.formatted_time).toBe('00:03');
    });
});
