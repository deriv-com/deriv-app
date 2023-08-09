import { useFetch } from '@deriv/api';
import { renderHook } from '@testing-library/react-hooks';
import useCurrencyConfig from '../useCurrencyConfig';
import { withMockAPIProvider } from '../mocks';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'website_status'>>;
describe('useCurrencyConfig', () => {
    test("should return undefined if the currency doesn't exist in currencies_config", () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({});

        const wrapper = withMockAPIProvider();

        const { result } = renderHook(() => useCurrencyConfig(), { wrapper });

        expect(result.current.getConfig('USD')).toBe(undefined);
    });

    test('should return currency config object for the given currency', () => {
        mockUseFetch.mockReturnValue({
            // @ts-expect-error need to come up with a way to mock the return type of useFetch
            data: { website_status: { currencies_config: { USD: { type: 'fiat', name: 'US Dollar' } } } },
        });

        const wrapper = withMockAPIProvider();

        const { result } = renderHook(() => useCurrencyConfig(), { wrapper });

        expect(result.current.getConfig('USD')?.code).toBe('USD');
        expect(result.current.getConfig('USD')?.icon).toBe('IcCurrencyUsd');
        expect(result.current.getConfig('USD')?.is_fiat).toBe(true);
        expect(result.current.getConfig('USD')?.is_crypto).toBe(false);
        expect(result.current.getConfig('USD')?.is_USD).toBe(true);
    });
});
