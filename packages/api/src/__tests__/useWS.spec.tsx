import { renderHook, act } from '@testing-library/react-hooks';
import { useWS as useWSShared } from '@deriv/shared';
import useWS from '../useWS';
import { TSocketResponse } from '../../types';

jest.mock('@deriv/shared');

const mockUseWSShared = useWSShared as jest.MockedFunction<typeof useWSShared>;

describe('useWS', () => {
    test('should have initial error and data of undefined and is_loading of false', async () => {
        const { result } = renderHook(() => useWS('ping'));

        expect(result.current.is_loading).toBe(false);
        expect(result.current.error).toBe(undefined);
        expect(result.current.data).toBe(undefined);
    });

    test('should call ping and get pong in response', async () => {
        mockUseWSShared.mockReturnValue({
            send: jest.fn(() =>
                Promise.resolve<TSocketResponse<'ping'>>({
                    msg_type: 'ping',
                    ping: 'pong',
                    echo_req: {},
                })
            ),
        });

        const { result, waitForNextUpdate } = renderHook(() => useWS('ping'));

        expect(result.current.is_loading).toBe(false);
        expect(result.current.error).toBe(undefined);
        expect(result.current.data).toBe(undefined);

        act(() => {
            result.current.send();
        });

        expect(result.current.is_loading).toBe(true);
        await waitForNextUpdate();
        expect(result.current.data).toBe('pong');
        expect(result.current.error).toBe(undefined);
        expect(result.current.is_loading).toBe(false);
    });

    test('should call verify_email and get 1 in response', async () => {
        mockUseWSShared.mockReturnValue({
            send: jest.fn(() =>
                Promise.resolve<TSocketResponse<'verify_email'>>({
                    verify_email: 1,
                    msg_type: 'verify_email',
                    echo_req: {},
                })
            ),
        });

        const { result, waitForNextUpdate } = renderHook(() => useWS('verify_email'));

        expect(result.current.is_loading).toBe(false);
        expect(result.current.error).toBe(undefined);
        expect(result.current.data).toBe(undefined);

        act(() => {
            result.current.send({ verify_email: 'test@test.com', type: 'reset_password' });
        });

        expect(result.current.is_loading).toBe(true);
        await waitForNextUpdate();
        expect(result.current.data).toBe(1);
        expect(result.current.error).toBe(undefined);
        expect(result.current.is_loading).toBe(false);
    });

    test('should call cashier and get ASK_TNC_APPROVAL error code in response', async () => {
        mockUseWSShared.mockReturnValue({
            send: jest.fn(() =>
                Promise.resolve<TSocketResponse<'cashier'>>({
                    msg_type: 'cashier',
                    echo_req: {},
                    error: {
                        code: 'ASK_TNC_APPROVAL',
                        message: 'Error message',
                    },
                })
            ),
        });

        const { result, waitForNextUpdate } = renderHook(() => useWS('cashier'));

        expect(result.current.is_loading).toBe(false);
        expect(result.current.error).toBe(undefined);
        expect(result.current.data).toBe(undefined);

        act(() => {
            result.current.send({ cashier: 'deposit' });
        });

        expect(result.current.is_loading).toBe(true);
        await waitForNextUpdate();
        expect(result.current.data).toBe(undefined);
        expect(result.current.error).toStrictEqual({ code: 'ASK_TNC_APPROVAL', message: 'Error message' });
        expect(result.current.is_loading).toBe(false);
    });
});
