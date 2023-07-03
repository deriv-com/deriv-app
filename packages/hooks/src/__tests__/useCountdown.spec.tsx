import { act, renderHook } from '@testing-library/react-hooks';
import useCountdown from '../useCountdown';

jest.setTimeout(30000);

describe('useCountdown', () => {
    test('should have initial count of 60 and is_running of false', () => {
        const { result } = renderHook(() => useCountdown({ from: 60 }));

        expect(result.current.count).toBe(60);
        expect(result.current.is_running).toBe(false);
    });

    test('should count down from 2 to 0 after start is called and stop once finished', async () => {
        const { result, waitForNextUpdate } = renderHook(() => useCountdown({ from: 2 }));

        expect(result.current.count).toBe(2);
        expect(result.current.is_running).toBe(false);

        act(() => {
            result.current.start();
        });

        expect(result.current.is_running).toBe(true);
        await waitForNextUpdate();
        expect(result.current.count).toBe(1);
        await waitForNextUpdate();
        expect(result.current.count).toBe(0);
        await waitForNextUpdate();
        expect(result.current.is_running).toBe(false);
    });

    test('should count down from 1 to -1 after start is called and stop once finished', async () => {
        const { result, waitForNextUpdate } = renderHook(() => useCountdown({ from: 1, to: -1 }));
        expect(result.current.count).toBe(1);
        expect(result.current.is_running).toBe(false);

        act(() => {
            result.current.start();
        });

        expect(result.current.is_running).toBe(true);
        await waitForNextUpdate();
        expect(result.current.count).toBe(0);
        await waitForNextUpdate();
        expect(result.current.count).toBe(-1);
        await waitForNextUpdate();
        expect(result.current.is_running).toBe(false);
    });

    test('should count down from -1 to 1 after start is called and stop once finished', async () => {
        const { result, waitForNextUpdate } = renderHook(() => useCountdown({ from: -1, to: 1, increment: true }));
        expect(result.current.count).toBe(-1);
        expect(result.current.is_running).toBe(false);

        act(() => {
            result.current.start();
        });

        expect(result.current.is_running).toBe(true);
        await waitForNextUpdate();
        expect(result.current.count).toBe(0);
        await waitForNextUpdate();
        expect(result.current.count).toBe(1);
        await waitForNextUpdate();
        expect(result.current.is_running).toBe(false);
    });

    test('should count down from 3 to 0 after start is called and reset the counter at 1 and stop once finished', async () => {
        const { result, waitForNextUpdate } = renderHook(() => useCountdown({ from: 3 }));
        expect(result.current.count).toBe(3);
        expect(result.current.is_running).toBe(false);

        act(() => {
            result.current.start();
        });

        expect(result.current.is_running).toBe(true);
        await waitForNextUpdate();
        expect(result.current.count).toBe(2);
        await waitForNextUpdate();
        expect(result.current.count).toBe(1);

        act(() => {
            result.current.reset();
        });

        expect(result.current.count).toBe(3);
        await waitForNextUpdate();
        expect(result.current.count).toBe(2);
        await waitForNextUpdate();
        expect(result.current.count).toBe(1);
        await waitForNextUpdate();
        expect(result.current.count).toBe(0);
        await waitForNextUpdate();
        expect(result.current.is_running).toBe(false);
    });

    test('should count down from 3 to 0 after start is called and pause the counter at 1', async () => {
        const { result, waitForNextUpdate } = renderHook(() => useCountdown({ from: 3 }));
        expect(result.current.count).toBe(3);
        expect(result.current.is_running).toBe(false);

        act(() => {
            result.current.start();
        });

        expect(result.current.is_running).toBe(true);
        await waitForNextUpdate();
        expect(result.current.count).toBe(2);
        await waitForNextUpdate();
        expect(result.current.count).toBe(1);

        act(() => {
            result.current.pause();
        });

        expect(result.current.count).toBe(1);
        expect(result.current.is_running).toBe(false);
    });

    test('should count down from 3 to 0 after start is called and stop the counter at 1', async () => {
        const { result, waitForNextUpdate } = renderHook(() => useCountdown({ from: 3 }));

        expect(result.current.count).toBe(3);
        expect(result.current.is_running).toBe(false);

        act(() => {
            result.current.start();
        });

        expect(result.current.is_running).toBe(true);
        await waitForNextUpdate();
        expect(result.current.count).toBe(2);
        await waitForNextUpdate();
        expect(result.current.count).toBe(1);

        act(() => {
            result.current.stop();
        });

        expect(result.current.count).toBe(3);
        expect(result.current.is_running).toBe(false);
    });
});
