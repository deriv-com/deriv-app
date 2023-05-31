import * as React from 'react';
import { APIProvider, useFetch } from '@deriv/api';
import { renderHook } from '@testing-library/react-hooks';
import useCurrencyConfig from '../useCurrencyConfig';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'website_status'>>;

describe('useCurrencyConfig', () => {
    test("should return undefined if the currency doesn't exist in currencies_config", () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({});

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useCurrencyConfig('USD'), { wrapper });

        expect(result.current.data).toBe(undefined);
    });

    test('should return currency config object for the given currency', () => {
        mockUseFetch.mockReturnValue({
            // @ts-expect-error need to come up with a way to mock the return type of useFetch
            data: { website_status: { currencies_config: { USD: { type: 'fiat', name: 'US Dollar' } } } },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useCurrencyConfig('USD'), { wrapper });

        expect(result.current.data?.code).toBe('USD');
        expect(result.current.data?.icon).toBe('IcCurrencyUsd');
        expect(result.current.data?.is_fiat).toBe(true);
        expect(result.current.data?.is_crypto).toBe(false);
    });
});
