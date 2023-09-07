import * as React from 'react';
import { APIProvider } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useCurrentCurrencyConfig from '../useCurrentCurrencyConfig';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(() => ({
        data: { website_status: { currencies_config: { USD: { type: 'fiat', name: 'US Dollar' } } } },
    })),
}));

describe('useCurrentCurrencyConfig', () => {
    test("should return undefined if the user's currency doesn't exist in currencies_config", () => {
        const mock = mockStore({ client: { currency: 'BTC' } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useCurrentCurrencyConfig(), { wrapper });

        expect(result.current).toBe(undefined);
    });

    test("should return currency config object for the user's currency", () => {
        const mock = mockStore({ client: { currency: 'USD' } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useCurrentCurrencyConfig(), { wrapper });

        expect(result.current.code).toBe('USD');
        expect(result.current.icon).toBe('IcCurrencyUsd');
        expect(result.current.is_fiat).toBe(true);
        expect(result.current.is_crypto).toBe(false);
        expect(result.current.is_USD).toBe(true);
    });
});
