import { mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import { withMockAPIProvider } from '../mocks';
import useIsP2PEnabled from '../useIsP2PEnabled';
import useP2PSettings from '../useP2PSettings';

jest.mock('../useP2PSettings');

const mockUseP2PSettings = useP2PSettings as jest.MockedFunction<typeof useP2PSettings>;

describe('useIsP2PEnabled', () => {
    beforeEach(() => {
        mockUseP2PSettings.mockReturnValue({
            // @ts-expect-error need to come up with a way to mock the return type
            p2p_settings: {
                supported_currencies: ['usd'],
            },
            // @ts-expect-error need to come up with a way to mock the return type
            rest: {
                isLoading: false,
                isSubscribed: true,
                isIdle: false,
                error: undefined,
            },
        });
    });
    test('should return false if users currency is not supported in p2p', () => {
        const mock = mockStore({ client: { currency: 'AUD' } });

        const wrapper = withMockAPIProvider(mock, true);

        const { result } = renderHook(() => useIsP2PEnabled(), { wrapper });

        expect(result.current.is_p2p_enabled).toBe(false);
    });

    test('should return false if users currency is supported in p2p but is virtual', () => {
        const mock = mockStore({
            client: {
                currency: 'USD',
                is_virtual: true,
            },
        });

        const wrapper = withMockAPIProvider(mock, true);

        const { result } = renderHook(() => useIsP2PEnabled(), { wrapper });

        expect(result.current.is_p2p_enabled).toBe(false);
    });

    test('should return true if users currency is supported in p2p and is_low_risk_cr_eu_real is false', () => {
        const mock = mockStore({
            client: {
                currency: 'USD',
            },
        });

        const wrapper = withMockAPIProvider(mock, true);

        const { result } = renderHook(() => useIsP2PEnabled(), { wrapper });

        expect(result.current.is_p2p_enabled).toBe(true);
    });

    test('should return false if users currency is supported in p2p but is_low_risk_cr_eu_real is true', () => {
        const mock = mockStore({
            client: {
                currency: 'USD',
            },
            traders_hub: {
                is_low_risk_cr_eu_real: true,
            },
        });

        const wrapper = withMockAPIProvider(mock, true);

        const { result } = renderHook(() => useIsP2PEnabled(), { wrapper });

        expect(result.current.is_p2p_enabled).toBe(false);
    });
});
