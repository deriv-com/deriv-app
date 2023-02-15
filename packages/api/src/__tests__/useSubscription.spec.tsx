import { renderHook, act } from '@testing-library/react-hooks';
import { useWS as useWSShared } from '@deriv/shared';
import useSubscription from '../useSubscription';

jest.mock('@deriv/shared');

const mockUseWSShared = useWSShared as jest.MockedFunction<typeof useWSShared>;

describe('useSubscription', () => {
    test('should subscribe to p2p_order_info and get the order updates', async () => {
        mockUseWSShared.mockReturnValue({
            subscribe: jest.fn(() => {
                return {
                    subscribe: async (onData: (response: unknown) => void, onError: (response: unknown) => void) => {
                        const delay = (ms: number) => new Promise<never>(resolve => setTimeout(resolve, ms));
                        await delay(500);
                        onData({ p2p_order_info: { status: 'pending' } });
                        await delay(500);
                        onData({ p2p_order_info: { status: 'buyer-confirmed' } });
                        await delay(500);
                        onData({ p2p_order_info: { status: 'disputed' } });
                        await delay(500);
                        onError({ error: { code: 'Foo', message: 'Error message' } });
                        await delay(500);
                        onData({ p2p_order_info: { status: 'completed' } });
                        return { unsubscribe: () => Promise.resolve() };
                    },
                };
            }),
        });

        const { result, waitForNextUpdate } = renderHook(() => useSubscription('p2p_order_info'));

        expect(result.current.is_loading).toBe(false);
        expect(result.current.error).toBe(undefined);
        expect(result.current.data).toBe(undefined);

        act(() => {
            result.current.subscribe({ id: '2' });
        });

        await waitForNextUpdate();
        expect(result.current.data).toStrictEqual({ status: 'pending' });
        await waitForNextUpdate();
        expect(result.current.data).toStrictEqual({ status: 'buyer-confirmed' });
        await waitForNextUpdate();
        expect(result.current.data).toStrictEqual({ status: 'disputed' });
        await waitForNextUpdate();
        expect(result.current.error).toStrictEqual({ code: 'Foo', message: 'Error message' });
        await waitForNextUpdate();
        expect(result.current.data).toStrictEqual({ status: 'completed' });
    });
});
