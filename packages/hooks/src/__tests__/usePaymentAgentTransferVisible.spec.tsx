import { useFetch } from '@deriv/api';
import { mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import usePaymentAgentTransferVisible from '../usePaymentAgentTransferVisible';
import { withMockAPIProvider } from '../mocks';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'get_settings'>>;

describe('usePaymentAgentTransferVisible', () => {
    test('should return false if is_authenticated_payment_agent is 0', () => {
        const mock = mockStore({});

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({ data: { get_settings: { is_authenticated_payment_agent: 0 } } });

        const wrapper = withMockAPIProvider(mock);

        const { result } = renderHook(() => usePaymentAgentTransferVisible(), { wrapper });

        expect(result.current.data).toBe(false);
    });

    test('should return true if is_authenticated_payment_agent is 1', () => {
        const mock = mockStore({});

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({ data: { get_settings: { is_authenticated_payment_agent: 1 } } });

        const wrapper = withMockAPIProvider(mock);

        const { result } = renderHook(() => usePaymentAgentTransferVisible(), { wrapper });

        expect(result.current.data).toBe(true);
    });
});
