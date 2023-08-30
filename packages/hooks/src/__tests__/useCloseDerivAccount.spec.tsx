import { useRequest } from '@deriv/api';
import { renderHook } from '@testing-library/react-hooks';
import useCloseDerivAccount from '../useCloseDerivAccount';

// Mocking the useRequest hook
jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useRequest: jest.fn(() => ({ mutate: jest.fn() })),
}));

// @ts-expect-error need to come up with a way to mock the return type of useFetch
const mockUseRequest = useRequest as jest.MockedFunction<typeof useRequest<'account_closure'>>;

describe('useCloseDerivAccount', () => {
    test('should return the correct initial values', () => {
        mockUseRequest.mockReturnValue({
            // @ts-expect-error need to come up with a way to mock the return type of useFetch
            data: { account_closure: 1 },
            mutate: jest.fn(),
            error: null,
            isError: false,
            isSuccess: false,
            isLoading: false,
        });
        const { result } = renderHook(() => useCloseDerivAccount());
        expect(result.current.error).toBeNull();
        expect(result.current.isError).toBe(false);
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.isLoading).toBe(false);
    });

    test('should handle error during account closure', async () => {
        const mockMutate = jest.fn(() => new Error('Account closure failed'));
        mockUseRequest.mockReturnValue({
            // @ts-expect-error need to come up with a way to mock the return type of useFetch
            data: { account_closure: 1 },
            mutate: mockMutate,
            error: 'Account closure failed',
            isError: true,
            isSuccess: false,
            isLoading: false,
        });
        const { result } = renderHook(() => useCloseDerivAccount());

        await result.current.mutate({ payload: { reason: 'test' } });

        expect(result.current.mutate).toHaveBeenCalled();
        expect(result.current.isError).toBe(true);
        expect(result.current.error).toBe('Account closure failed');
    });

    it('should handle successful accout closure', async () => {
        const mockMutate = jest.fn(() => ({ account_closure: 1 }));

        // @ts-expect-error ignore this until find a way to make arguments as partial
        mockUseRequest.mockReturnValue({
            isLoading: false,
            isSuccess: true,
            data: { account_closure: 1 },
            mutate: mockMutate,
        });

        const { result } = renderHook(() => useCloseDerivAccount());

        // Simulate a successful closure
        await result.current.mutate({ payload: { reason: 'test' } });

        expect(result.current.mutate).toHaveBeenCalled();
        expect(result.current.isSuccess).toBe(true);
    });
});
