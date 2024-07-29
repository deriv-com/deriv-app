import { useAuthorize, useBalanceSubscription } from '@deriv/api-v2';
import { renderHook } from '@testing-library/react-hooks';
import useAllBalanceSubscription from '../useAllBalanceSubscription';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useAuthorize: jest.fn(),
    useBalanceSubscription: jest.fn(),
}));

const mockAuthorize = useAuthorize as jest.MockedFunction<typeof useAuthorize>;
const mockUseBalanceSubscription = useBalanceSubscription as jest.MockedFunction<typeof useBalanceSubscription>;

describe('useAllBalanceSubscription', () => {
    it('does not subscribe to all balance when subscribeToAllBalance is called before authorize', () => {
        const mockSubscribe = jest.fn();
        const mockUnsubscribe = jest.fn();
        (mockUseBalanceSubscription as jest.Mock).mockReturnValue({
            data: {},
            isLoading: false,
            isSubscribed: false,
            subscribe: mockSubscribe,
            unsubscribe: mockUnsubscribe,
        });
        (mockAuthorize as jest.Mock).mockReturnValue({
            isSuccess: false,
        });
        const { result } = renderHook(() => useAllBalanceSubscription());
        const { subscribeToAllBalance } = result.current;
        subscribeToAllBalance();
        expect(mockSubscribe).not.toHaveBeenCalled();
    });
    it('subscribes to all balance when subscribeToAllBalance is called', () => {
        const mockSubscribe = jest.fn();
        const mockUnsubscribe = jest.fn();
        (mockUseBalanceSubscription as jest.Mock).mockReturnValue({
            data: {},
            isLoading: false,
            isSubscribed: false,
            subscribe: mockSubscribe,
            unsubscribe: mockUnsubscribe,
        });
        (mockAuthorize as jest.Mock).mockReturnValue({
            isSuccess: true,
        });
        const { result } = renderHook(() => useAllBalanceSubscription());
        const { subscribeToAllBalance } = result.current;
        subscribeToAllBalance();
        expect(mockSubscribe).toHaveBeenCalledWith({
            account: 'all',
        });
    });
    it('does not set data before the subscription is successful', () => {
        const mockSubscribe = jest.fn();
        const mockUnsubscribe = jest.fn();
        (mockUseBalanceSubscription as jest.Mock).mockReturnValue({
            data: {
                accounts: {
                    CRW1: {
                        balance: 100,
                        currency: 'USD',
                    },
                },
            },
            isLoading: true,
            isSubscribed: false,
            subscribe: mockSubscribe,
            unsubscribe: mockUnsubscribe,
        });
        (mockAuthorize as jest.Mock).mockReturnValue({
            isSuccess: true,
        });
        const { result } = renderHook(() => useAllBalanceSubscription());
        expect(result.current.data).toBeUndefined();
        expect(result.current.isLoading).toBeTruthy();
    });
    it('sets data when the initial subscription is successful', () => {
        const mockSubscribe = jest.fn();
        const mockUnsubscribe = jest.fn();
        (mockUseBalanceSubscription as jest.Mock).mockReturnValue({
            data: {
                accounts: {
                    CRW1: {
                        balance: 100,
                        currency: 'USD',
                    },
                },
            },
            isLoading: false,
            isSubscribed: true,
            subscribe: mockSubscribe,
            unsubscribe: mockUnsubscribe,
        });
        (mockAuthorize as jest.Mock).mockReturnValue({
            isSuccess: true,
        });
        const { result } = renderHook(() => useAllBalanceSubscription());
        expect(result.current.data).toEqual({
            CRW1: {
                balance: 100,
                currency: 'USD',
            },
        });
    });
    it('sets the data when the subsequent responses are received from the api', () => {
        const mockSubscribe = jest.fn();
        const mockUnsubscribe = jest.fn();
        (mockUseBalanceSubscription as jest.Mock).mockReturnValue({
            data: {
                balance: 9996,
                currency: 'USD',
                loginid: 'CRW1',
                total: {
                    deriv: {
                        amount: 10000,
                        currency: 'USD',
                    },
                },
            },
            isLoading: false,
            isSubscribed: true,
            subscribe: mockSubscribe,
            unsubscribe: mockUnsubscribe,
        });
        (mockAuthorize as jest.Mock).mockReturnValue({
            isSuccess: true,
        });
        const { result } = renderHook(() => useAllBalanceSubscription());
        expect(result.current.data).toEqual({
            CRW1: {
                balance: 9996,
                converted_amount: 9996,
                currency: 'USD',
                demo_account: 0,
                status: 0,
                type: 'deriv',
            },
        });
    });
});
