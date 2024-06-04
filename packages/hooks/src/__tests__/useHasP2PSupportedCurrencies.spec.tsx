import { mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import { withMockAPIProvider } from '../mocks';
import useHasP2PSupportedCurrencies from '../useHasP2PSupportedCurrencies';
import useP2PSettings from '../useP2PSettings';

jest.mock('../useP2PSettings');

const mockUseP2PSettings = useP2PSettings as jest.MockedFunction<typeof useP2PSettings>;

describe('useHasP2PSupportedCurrencies', () => {
    beforeEach(() => {
        mockUseP2PSettings.mockReturnValue({
            // @ts-expect-error need to come up with a way to mock the return type
            p2p_settings: {
                supported_currencies: ['usd'],
            },
        });
    });

    test('should return false if supported currencies is not in the account info', () => {
        const mock = mockStore({
            client: {
                active_accounts: [{ currency: 'EUR', is_virtual: 0 }],
            },
        });

        const wrapper = withMockAPIProvider(mock, true);

        const { result } = renderHook(() => useHasP2PSupportedCurrencies(), { wrapper });

        expect(result.current.data).toBe(false);
    });

    test('should return true if supported currencies is in the account info', () => {
        const mock = mockStore({
            client: {
                active_accounts: [{ currency: 'USD', is_virtual: 0 }],
            },
        });

        const wrapper = withMockAPIProvider(mock, true);

        const { result } = renderHook(() => useHasP2PSupportedCurrencies(), { wrapper });

        expect(result.current.data).toBe(true);
    });

    test('should return false if there is no real account', () => {
        const mock = mockStore({
            client: {
                active_accounts: [{ currency: 'USD', is_virtual: 1 }],
            },
        });

        const wrapper = withMockAPIProvider(mock, true);

        const { result } = renderHook(() => useHasP2PSupportedCurrencies(), { wrapper });

        expect(result.current.data).toBe(false);
    });
});
